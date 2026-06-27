const express = require('express');
const router = express.Router();
const {
  requestBook, issueBook, returnBook, renewBook, rejectRequest,
  getMyBorrows, getAllBorrows, getOverdueBooks, getPendingRequests,
  getBorrowStats
} = require('../controllers/borrowController');
const { protect, admin } = require('../middleware/auth');

router.post('/request', protect, requestBook);
router.get('/my-borrows', protect, getMyBorrows);
router.get('/stats', protect, admin, getBorrowStats);
router.get('/overdue', protect, admin, getOverdueBooks);
router.get('/pending', protect, admin, getPendingRequests);
router.put('/issue/:id', protect, admin, issueBook);
router.put('/return/:id', protect, returnBook);
router.put('/renew/:id', protect, renewBook);
router.put('/reject/:id', protect, admin, rejectRequest);
router.get('/', protect, admin, getAllBorrows);

module.exports = router;
