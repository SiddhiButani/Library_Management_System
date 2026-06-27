const express = require('express');
const router = express.Router();
const { submitMessage, getMessages, replyMessage, markAsRead } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', submitMessage);
router.get('/', protect, admin, getMessages);
router.put('/:id/reply', protect, admin, replyMessage);
router.put('/:id/read', protect, admin, markAsRead);

module.exports = router;
