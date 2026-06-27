const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  issueDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'returned', 'overdue', 'rejected'],
    default: 'pending'
  },
  renewCount: {
    type: Number,
    default: 0
  },
  maxRenewals: {
    type: Number,
    default: 1
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  returnedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fine: {
    type: Number,
    default: 0
  },
  fineStatus: {
    type: String,
    enum: ['none', 'pending', 'paid', 'waived'],
    default: 'none'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
