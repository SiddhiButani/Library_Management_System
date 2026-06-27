const express = require('express');
const router = express.Router();
const { getDashboardStats, getMemberDashboard } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/member-dashboard', protect, getMemberDashboard);

module.exports = router;
