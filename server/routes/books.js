const express = require('express');
const router = express.Router();
const {
  getBooks, getBook, addBook, updateBook, deleteBook,
  checkAvailability, getBookStats, getCategories,
  addCategory, updateCategory, deleteCategory
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/stats', protect, admin, getBookStats);
router.get('/categories', getCategories);
router.post('/categories', protect, admin, addCategory);
router.put('/categories/:id', protect, admin, updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);
router.get('/availability/:id', checkAvailability);
router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', protect, admin, upload.single('coverImage'), addBook);
router.put('/:id', protect, admin, upload.single('coverImage'), updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;
