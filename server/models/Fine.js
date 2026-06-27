const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRecord',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    default: 'Late return'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'waived'],
    default: 'pending'
  },
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'online', ''],
    default: ''
  },
  transactionId: {
    type: String,
    default: ''
  },
  waivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  waivedReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Fine', fineSchema);
