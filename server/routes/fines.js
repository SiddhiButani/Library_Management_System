const express = require('express');
const router = express.Router();
const { getMyFines, payFine, getAllFines, waiveFine, getFineStats } = require('../controllers/fineController');
const { protect, admin } = require('../middleware/auth');

router.get('/my-fines', protect, getMyFines);
router.post('/pay/:id', protect, payFine);
router.get('/stats', protect, admin, getFineStats);
router.get('/', protect, admin, getAllFines);
router.put('/waive/:id', protect, admin, waiveFine);

module.exports = router;
