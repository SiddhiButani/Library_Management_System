const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');
const Fine = require('../models/Fine');
const WaitingList = require('../models/WaitingList');
const { calculateFine, getBorrowDuration, getMaxBooks, getMaxRenewals } = require('../utils/fineCalculator');
const { createNotification } = require('./notificationController');

// @desc    Member requests a book
// @route   POST /api/borrows/request
exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'Book is not available. Please join the waiting list.' });
    }

    // Check if user already has this book (pending or issued)
    const existingBorrow = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['pending', 'issued'] }
    });

    if (existingBorrow) {
      return res.status(400).json({ success: false, message: 'You already have this book or a pending request' });
    }

    // Check max books limit
    const activeBorrows = await BorrowRecord.countDocuments({
      user: userId,
      status: { $in: ['pending', 'issued'] }
    });

    const maxBooks = await getMaxBooks(req.user.membershipType);
    if (activeBorrows >= maxBooks) {
      return res.status(400).json({
        success: false,
        message: `You've reached your maximum borrow limit (${maxBooks} books for ${req.user.membershipType} membership)`
      });
    }

    // Check for unpaid fines
    const unpaidFines = await Fine.countDocuments({ user: userId, status: 'pending' });
    if (unpaidFines > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have unpaid fines. Please clear them before borrowing.'
      });
    }

    const borrowDuration = await getBorrowDuration(req.user.membershipType);
    const maxRenewals = await getMaxRenewals(req.user.membershipType);

    const borrow = await BorrowRecord.create({
      user: userId,
      book: bookId,
      maxRenewals,
      notes: `Borrow duration: ${borrowDuration} days`
    });

    await borrow.populate([
      { path: 'book', select: 'title author isbn coverImage' },
      { path: 'user', select: 'name email' }
    ]);

    await createNotification(
      userId,
      'Borrow Request Received',
      `Your request to borrow "${book.title}" has been placed and is pending admin approval.`,
      'info'
    );

    res.status(201).json({ success: true, borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin confirms issue
// @route   PUT /api/borrows/issue/:id
exports.issueBook = async (req, res) => {
  try {
    const borrow = await BorrowRecord.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This request is not pending' });
    }

    const book = await Book.findById(borrow.book);
    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available' });
    }

    const user = await User.findById(borrow.user);
    const borrowDuration = await getBorrowDuration(user.membershipType);

    borrow.status = 'issued';
    borrow.issueDate = new Date();
    borrow.dueDate = new Date(Date.now() + borrowDuration * 24 * 60 * 60 * 1000);
    borrow.issuedBy = req.user._id;
    await borrow.save();

    book.availableCopies -= 1;
    await book.save();

    await borrow.populate([
      { path: 'book', select: 'title author isbn coverImage' },
      { path: 'user', select: 'name email' },
      { path: 'issuedBy', select: 'name' }
    ]);

    await createNotification(
      borrow.user,
      'Book Issued',
      `Your request to borrow "${book.title}" has been approved! Due Date is ${borrow.dueDate.toLocaleDateString()}.`,
      'success'
    );

    res.json({ success: true, borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process return
// @route   PUT /api/borrows/return/:id
exports.returnBook = async (req, res) => {
  try {
    const borrow = await BorrowRecord.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.status !== 'issued' && borrow.status !== 'overdue') {
      return res.status(400).json({ success: false, message: 'This book is not currently issued' });
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';
    borrow.returnedTo = req.user._id;

    // Calculate fine if late
    const fineAmount = await calculateFine(borrow.dueDate, borrow.returnDate);
    if (fineAmount > 0) {
      borrow.fine = fineAmount;
      borrow.fineStatus = 'pending';

      await Fine.create({
        user: borrow.user,
        borrowRecord: borrow._id,
        amount: fineAmount,
        reason: `Late return - ${Math.ceil((borrow.returnDate - borrow.dueDate) / (1000 * 60 * 60 * 24))} days overdue`
      });
    }

    await borrow.save();

    // Increment available copies
    const book = await Book.findById(borrow.book);
    book.availableCopies += 1;
    await book.save();

    // Notify first person on waiting list
    const nextInLine = await WaitingList.findOne({
      book: borrow.book,
      status: 'waiting'
    }).sort({ position: 1 });

    if (nextInLine) {
      nextInLine.status = 'notified';
      nextInLine.notifiedAt = new Date();
      await nextInLine.save();
    }

    await borrow.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'user', select: 'name email' }
    ]);

    res.json({
      success: true,
      borrow,
      fineAmount,
      message: fineAmount > 0 ? `Book returned with a fine of ₹${fineAmount}` : 'Book returned successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Renew a book
// @route   PUT /api/borrows/renew/:id
exports.renewBook = async (req, res) => {
  try {
    const borrow = await BorrowRecord.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.status !== 'issued') {
      return res.status(400).json({ success: false, message: 'Only issued books can be renewed' });
    }

    if (borrow.renewCount >= borrow.maxRenewals) {
      return res.status(400).json({ success: false, message: 'Maximum renewals reached' });
    }

    // Check if overdue — can't renew overdue books
    if (new Date() > borrow.dueDate) {
      return res.status(400).json({ success: false, message: 'Cannot renew overdue books. Please return first.' });
    }

    // Check if someone is waiting for this book
    const waitlistCount = await WaitingList.countDocuments({
      book: borrow.book,
      status: 'waiting'
    });

    if (waitlistCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot renew. Other members are waiting for this book.'
      });
    }

    const user = await User.findById(borrow.user);
    const borrowDuration = await getBorrowDuration(user.membershipType);

    borrow.dueDate = new Date(borrow.dueDate.getTime() + borrowDuration * 24 * 60 * 60 * 1000);
    borrow.renewCount += 1;
    await borrow.save();

    await borrow.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'user', select: 'name email' }
    ]);

    res.json({
      success: true,
      borrow,
      message: `Book renewed. New due date: ${borrow.dueDate.toLocaleDateString()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject a borrow request (admin)
// @route   PUT /api/borrows/reject/:id
exports.rejectRequest = async (req, res) => {
  try {
    const borrow = await BorrowRecord.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be rejected' });
    }

    borrow.status = 'rejected';
    borrow.notes = req.body.reason || 'Request rejected by admin';
    await borrow.save();

    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member's borrow history
// @route   GET /api/borrows/my-borrows
exports.getMyBorrows = async (req, res) => {
  try {
    const status = req.query.status || '';
    let query = { user: req.user._id };
    if (status) query.status = status;

    const borrows = await BorrowRecord.find(query)
      .populate('book', 'title author isbn coverImage category type')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, borrows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all borrow records (admin)
// @route   GET /api/borrows
exports.getAllBorrows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';
    const search = req.query.search || '';

    let query = {};
    if (status) query.status = status;

    let borrows = BorrowRecord.find(query)
      .populate('book', 'title author isbn coverImage')
      .populate('user', 'name email membershipType')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BorrowRecord.countDocuments(query);
    const results = await borrows;

    // Filter by search if provided (after population)
    let filtered = results;
    if (search) {
      const s = search.toLowerCase();
      filtered = results.filter(b =>
        b.book?.title?.toLowerCase().includes(s) ||
        b.user?.name?.toLowerCase().includes(s) ||
        b.user?.email?.toLowerCase().includes(s) ||
        b.book?.isbn?.toLowerCase().includes(s)
      );
    }

    res.json({
      success: true,
      borrows: filtered,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get overdue books (admin)
// @route   GET /api/borrows/overdue
exports.getOverdueBooks = async (req, res) => {
  try {
    const overdue = await BorrowRecord.find({
      status: 'issued',
      dueDate: { $lt: new Date() }
    })
      .populate('book', 'title author isbn')
      .populate('user', 'name email phone')
      .sort({ dueDate: 1 });

    // Update status to overdue
    for (const record of overdue) {
      if (record.status === 'issued') {
        record.status = 'overdue';
        await record.save();
      }
    }

    res.json({ success: true, borrows: overdue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending requests (admin)
// @route   GET /api/borrows/pending
exports.getPendingRequests = async (req, res) => {
  try {
    const pending = await BorrowRecord.find({ status: 'pending' })
      .populate('book', 'title author isbn availableCopies coverImage')
      .populate('user', 'name email membershipType')
      .sort({ createdAt: 1 });

    res.json({ success: true, borrows: pending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get borrow stats (admin)
// @route   GET /api/borrows/stats
exports.getBorrowStats = async (req, res) => {
  try {
    const totalIssued = await BorrowRecord.countDocuments({ status: 'issued' });
    const totalReturned = await BorrowRecord.countDocuments({ status: 'returned' });
    const totalPending = await BorrowRecord.countDocuments({ status: 'pending' });
    const totalOverdue = await BorrowRecord.countDocuments({
      status: 'issued',
      dueDate: { $lt: new Date() }
    });

    // Monthly borrows for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBorrows = await BorrowRecord.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Most borrowed books
    const popularBooks = await BorrowRecord.aggregate([
      { $group: { _id: '$book', borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' },
      { $project: { title: '$book.title', author: '$book.author', borrowCount: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalIssued,
        totalReturned,
        totalPending,
        totalOverdue,
        monthlyBorrows,
        popularBooks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
