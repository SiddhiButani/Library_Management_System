const Book = require('../models/Book');
const Category = require('../models/Category');
const BorrowRecord = require('../models/BorrowRecord');

// @desc    Get all books with search, filter, pagination
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const type = req.query.type || '';
    const available = req.query.available || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (type) query.type = type;
    if (available === 'true') query.availableCopies = { $gt: 0 };
    if (available === 'false') query.availableCopies = 0;

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('category', 'name icon')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      books,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name icon');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Get borrow count
    const borrowCount = await BorrowRecord.countDocuments({ book: book._id });
    const currentBorrowers = await BorrowRecord.countDocuments({ book: book._id, status: 'issued' });

    res.json({ success: true, book, borrowCount, currentBorrowers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add book (admin)
// @route   POST /api/books
exports.addBook = async (req, res) => {
  try {
    const bookData = { ...req.body };
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (bookData.tags && typeof bookData.tags === 'string') {
      bookData.tags = bookData.tags.split(',').map(t => t.trim());
    }

    const book = await Book.create(bookData);
    await book.populate('category', 'name icon');

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update book (admin)
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const bookData = { ...req.body };
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (bookData.tags && typeof bookData.tags === 'string') {
      bookData.tags = bookData.tags.split(',').map(t => t.trim());
    }

    const book = await Book.findByIdAndUpdate(req.params.id, bookData, {
      new: true,
      runValidators: true
    }).populate('category', 'name icon');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete book (admin)
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const activeBorrows = await BorrowRecord.countDocuments({
      book: book._id,
      status: { $in: ['issued', 'pending'] }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book with active borrows'
      });
    }

    book.isActive = false;
    await book.save();

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check book availability
// @route   GET /api/books/availability/:id
exports.checkAvailability = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const WaitingList = require('../models/WaitingList');
    const waitlistCount = await WaitingList.countDocuments({ book: book._id, status: 'waiting' });

    res.json({
      success: true,
      book: {
        title: book.title,
        author: book.author,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        isAvailable: book.availableCopies > 0,
        waitlistCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get book stats (admin)
// @route   GET /api/books/stats
exports.getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalCopies = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$totalCopies' }, available: { $sum: '$availableCopies' } } }
    ]);

    const byCategory = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', count: 1 } }
    ]);

    const byType = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalCopies: totalCopies[0]?.total || 0,
        availableCopies: totalCopies[0]?.available || 0,
        issuedCopies: (totalCopies[0]?.total || 0) - (totalCopies[0]?.available || 0),
        byCategory,
        byType
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/books/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('bookCount')
      .sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add category (admin)
// @route   POST /api/books/categories
exports.addCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category (admin)
// @route   PUT /api/books/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category (admin)
// @route   DELETE /api/books/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const booksInCategory = await Book.countDocuments({ category: req.params.id, isActive: true });
    if (booksInCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${booksInCategory} active books`
      });
    }

    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
