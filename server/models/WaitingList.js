const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
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
  position: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'cancelled', 'fulfilled'],
    default: 'waiting'
  },
  notifiedAt: Date
}, {
  timestamps: true
});

waitingListSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('WaitingList', waitingListSchema);
