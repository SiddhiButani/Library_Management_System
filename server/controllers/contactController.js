const ContactMessage = require('../models/ContactMessage');

// @desc    Submit contact message
// @route   POST /api/contact
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/contact
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';

    let query = {};
    if (status) query.status = status;

    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to message (admin)
// @route   PUT /api/contact/:id/reply
exports.replyMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    msg.status = 'replied';
    msg.reply = req.body.reply;
    msg.repliedBy = req.user._id;
    msg.repliedAt = new Date();
    await msg.save();

    res.json({ success: true, message: 'Reply sent', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
