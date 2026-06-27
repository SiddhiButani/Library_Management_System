const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please provide ISBN'],
    unique: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide category']
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  publishedYear: {
    type: Number
  },
  edition: {
    type: String,
    default: '1st'
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number,
    default: 0
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please provide total copies'],
    min: 0
  },
  availableCopies: {
    type: Number,
    min: 0
  },
  location: {
    shelf: { type: String, default: '' },
    rack: { type: String, default: '' }
  },
  type: {
    type: String,
    enum: ['book', 'journal', 'magazine'],
    default: 'book'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

bookSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

bookSchema.index({ title: 'text', author: 'text', isbn: 'text', tags: 'text' });

module.exports = mongoose.model('Book', bookSchema);
