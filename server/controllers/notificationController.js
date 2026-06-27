const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 notifications
    
    // If no notifications exist yet, create a welcoming one
    if (notifications.length === 0) {
      const welcome = await Notification.create({
        user: req.user.id,
        title: 'Welcome to LibraVerse!',
        message: 'Your real-time notification center is active. You will get alerts here when you borrow or return books!',
        type: 'info'
      });
      notifications = [welcome];
    }

    // Count unread
    const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Make sure notification belongs to user
    if (notification.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this notification' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to create notification programmatically (not a route)
exports.createNotification = async (userId, title, message, type = 'info') => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
