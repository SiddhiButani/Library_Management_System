const express = require('express');
const router = express.Router();
const {
  joinWaitingList, leaveWaitingList, getMyWaitingList, getAllWaitingLists
} = require('../controllers/waitlistController');
const { protect, admin } = require('../middleware/auth');

router.post('/join/:bookId', protect, joinWaitingList);
router.delete('/leave/:bookId', protect, leaveWaitingList);
router.get('/my-list', protect, getMyWaitingList);
router.get('/', protect, admin, getAllWaitingLists);

module.exports = router;
