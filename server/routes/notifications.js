const express = require('express');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All notification routes are protected

router.get('/', getUserNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
