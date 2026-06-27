const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const Fine = require('../models/Fine');

// @desc    Admin dashboard stats
// @route   GET /api/reports/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({ role: 'member', isActive: true });
    const totalBorrows = await BorrowRecord.countDocuments({ status: 'issued' });
    const totalOverdue = await BorrowRecord.countDocuments({
      status: { $in: ['issued', 'overdue'] },
      dueDate: { $lt: new Date() }
    });
    const pendingRequests = await BorrowRecord.countDocuments({ status: 'pending' });

    const totalFineAmount = await Fine.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const collectedFines = await Fine.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent activity
    const recentBorrows = await BorrowRecord.find()
      .populate('book', 'title')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Books by category
    const booksByCategory = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ['$category.name', 'Uncategorized'] }, count: 1 } },
      { $sort: { count: -1 } }
    ]);

    // Monthly borrow trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrends = await BorrowRecord.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          borrows: { $sum: 1 },
          returns: { $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // New members this month
    const newMembers = await User.countDocuments({
      role: 'member',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Total copies info
    const copiesInfo = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalCopies: { $sum: '$totalCopies' }, availableCopies: { $sum: '$availableCopies' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalMembers,
        activeMembers,
        totalBorrows,
        totalOverdue,
        pendingRequests,
        newMembers,
        totalCopies: copiesInfo[0]?.totalCopies || 0,
        availableCopies: copiesInfo[0]?.availableCopies || 0,
        pendingFines: totalFineAmount[0]?.total || 0,
        collectedFines: collectedFines[0]?.total || 0,
        recentBorrows,
        booksByCategory,
        monthlyTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Member dashboard stats
// @route   GET /api/reports/member-dashboard
exports.getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const activeBorrows = await BorrowRecord.find({
      user: userId,
      status: { $in: ['issued', 'overdue'] }
    })
      .populate('book', 'title author coverImage')
      .sort({ dueDate: 1 });

    const pendingRequests = await BorrowRecord.find({ user: userId, status: 'pending' })
      .populate('book', 'title author coverImage');

    const overdueBorrows = await BorrowRecord.countDocuments({
      user: userId,
      status: { $in: ['issued', 'overdue'] },
      dueDate: { $lt: new Date() }
    });

    const pendingFines = await Fine.aggregate([
      { $match: { user: userId, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const totalBorrowed = await BorrowRecord.countDocuments({ user: userId });
    const totalReturned = await BorrowRecord.countDocuments({ user: userId, status: 'returned' });

    // Recent transactions
    const recentActivity = await BorrowRecord.find({ user: userId })
      .populate('book', 'title author')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        activeBorrows,
        pendingRequests,
        overdueBorrows,
        pendingFines: pendingFines[0]?.total || 0,
        pendingFineCount: pendingFines[0]?.count || 0,
        totalBorrowed,
        totalReturned,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
