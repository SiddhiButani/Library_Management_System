const WaitingList = require('../models/WaitingList');
const Book = require('../models/Book');

// @desc    Join waiting list
// @route   POST /api/waitlist/join/:bookId
exports.joinWaitingList = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies > 0) {
      return res.status(400).json({ success: false, message: 'Book is available. You can borrow directly.' });
    }

    const existing = await WaitingList.findOne({
      user: req.user._id,
      book: req.params.bookId,
      status: 'waiting'
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You are already on the waiting list' });
    }

    // Get position
    const lastInLine = await WaitingList.findOne({ book: req.params.bookId, status: 'waiting' })
      .sort({ position: -1 });
    const position = lastInLine ? lastInLine.position + 1 : 1;

    const entry = await WaitingList.create({
      user: req.user._id,
      book: req.params.bookId,
      position
    });

    await entry.populate('book', 'title author');

    res.status(201).json({ success: true, entry, message: `You are #${position} on the waiting list` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Leave waiting list
// @route   DELETE /api/waitlist/leave/:bookId
exports.leaveWaitingList = async (req, res) => {
  try {
    const entry = await WaitingList.findOneAndUpdate(
      { user: req.user._id, book: req.params.bookId, status: 'waiting' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: 'You are not on the waiting list' });
    }

    // Re-number positions
    const remaining = await WaitingList.find({
      book: req.params.bookId,
      status: 'waiting',
      position: { $gt: entry.position }
    }).sort({ position: 1 });

    for (let i = 0; i < remaining.length; i++) {
      remaining[i].position = entry.position + i;
      await remaining[i].save();
    }

    res.json({ success: true, message: 'Removed from waiting list' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my waiting list
// @route   GET /api/waitlist/my-list
exports.getMyWaitingList = async (req, res) => {
  try {
    const list = await WaitingList.find({ user: req.user._id })
      .populate('book', 'title author isbn coverImage availableCopies')
      .sort({ createdAt: -1 });

    res.json({ success: true, list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all waiting lists (admin)
// @route   GET /api/waitlist
exports.getAllWaitingLists = async (req, res) => {
  try {
    const list = await WaitingList.find({ status: 'waiting' })
      .populate('user', 'name email')
      .populate('book', 'title author isbn availableCopies')
      .sort({ book: 1, position: 1 });

    res.json({ success: true, list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
