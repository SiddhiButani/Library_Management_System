const Fine = require('../models/Fine');
const BorrowRecord = require('../models/BorrowRecord');

// @desc    Get my fines
// @route   GET /api/fines/my-fines
exports.getMyFines = async (req, res) => {
  try {
    const fines = await Fine.find({ user: req.user._id })
      .populate({
        path: 'borrowRecord',
        populate: { path: 'book', select: 'title author isbn' }
      })
      .sort({ createdAt: -1 });

    const totalPending = fines
      .filter(f => f.status === 'pending')
      .reduce((sum, f) => sum + f.amount, 0);

    const totalPaid = fines
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({ success: true, fines, totalPending, totalPaid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pay a fine
// @route   POST /api/fines/pay/:id
exports.payFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'Fine not found' });
    }

    if (fine.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Fine is already paid or waived' });
    }

    fine.status = 'paid';
    fine.paidDate = new Date();
    fine.paymentMethod = req.body.paymentMethod || 'cash';
    fine.transactionId = req.body.transactionId || `TXN-${Date.now()}`;
    await fine.save();

    // Update borrow record fine status
    await BorrowRecord.findByIdAndUpdate(fine.borrowRecord, { fineStatus: 'paid' });

    res.json({ success: true, fine, message: 'Fine paid successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all fines (admin)
// @route   GET /api/fines
exports.getAllFines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';

    let query = {};
    if (status) query.status = status;

    const total = await Fine.countDocuments(query);
    const fines = await Fine.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'borrowRecord',
        populate: { path: 'book', select: 'title author isbn' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      fines,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Waive a fine (admin)
// @route   PUT /api/fines/waive/:id
exports.waiveFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'Fine not found' });
    }

    if (fine.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Fine is already paid or waived' });
    }

    fine.status = 'waived';
    fine.waivedBy = req.user._id;
    fine.waivedReason = req.body.reason || 'Waived by admin';
    await fine.save();

    await BorrowRecord.findByIdAndUpdate(fine.borrowRecord, { fineStatus: 'waived' });

    res.json({ success: true, fine, message: 'Fine waived successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get fine stats (admin)
// @route   GET /api/fines/stats
exports.getFineStats = async (req, res) => {
  try {
    const totalFines = await Fine.countDocuments();
    const pendingFines = await Fine.countDocuments({ status: 'pending' });
    const paidFines = await Fine.countDocuments({ status: 'paid' });
    const waivedFines = await Fine.countDocuments({ status: 'waived' });

    const totalAmount = await Fine.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const collectedAmount = await Fine.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = await Fine.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly fine collection
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyFines = await Fine.aggregate([
      { $match: { status: 'paid', paidDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$paidDate' }, month: { $month: '$paidDate' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalFines,
        pendingFines,
        paidFines,
        waivedFines,
        totalAmount: totalAmount[0]?.total || 0,
        collectedAmount: collectedAmount[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
        monthlyFines
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
