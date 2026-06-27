const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');
const { createNotification } = require('./notificationController');

// @desc    Get all users (admin)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const membership = req.query.membership || '';
    const status = req.query.status || '';

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (membership) query.membershipType = membership;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const borrowCount = await BorrowRecord.countDocuments({ user: user._id, status: 'issued' });

    res.json({ success: true, user, activeBorrows: borrowCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updateData = { name, phone, address };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, membershipType, isActive } = req.body;
    const updateData = { name, email, phone, address, role, membershipType, isActive };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upgrade membership
// @route   PUT /api/users/membership
// @access  Private
exports.upgradeMembership = async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ['basic', 'premium', 'gold'];

    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid membership plan' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hierarchy = { basic: 0, premium: 1, gold: 2 };
    
    if (hierarchy[plan] <= hierarchy[user.membershipType]) {
      return res.status(400).json({ success: false, message: 'Cannot downgrade or purchase the same membership tier.' });
    }

    user.membershipType = plan;
    // Extend expiry by 1 year from now
    user.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await user.save();

    await createNotification(
      user._id,
      'Membership Upgraded',
      `Congratulations! You have successfully upgraded to the ${plan} membership plan. Enjoy your new perks.`,
      'success'
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Deactivate user (admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has active borrows
    const activeBorrows = await BorrowRecord.countDocuments({
      user: user._id,
      status: { $in: ['issued', 'pending'] }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate user with active borrows'
      });
    }

    user.isActive = false;
    await user.save();

    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user stats (admin)
// @route   GET /api/users/stats
exports.getUserStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({ role: 'member', isActive: true });
    const newMembersThisMonth = await User.countDocuments({
      role: 'member',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    const membershipBreakdown = await User.aggregate([
      { $match: { role: 'member' } },
      { $group: { _id: '$membershipType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers,
        newMembersThisMonth,
        membershipBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
