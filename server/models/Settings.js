const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  libraryName: {
    type: String,
    default: 'City Central Library'
  },
  libraryEmail: {
    type: String,
    default: 'library@example.com'
  },
  libraryPhone: {
    type: String,
    default: '+1 234 567 890'
  },
  libraryAddress: {
    type: String,
    default: '123 Library Street, Book City, BC 12345'
  },
  finePerDay: {
    type: Number,
    default: 2
  },
  maxFineAmount: {
    type: Number,
    default: 100
  },
  borrowDuration: {
    basic: { type: Number, default: 14 },
    premium: { type: Number, default: 21 },
    gold: { type: Number, default: 30 }
  },
  maxBooks: {
    basic: { type: Number, default: 3 },
    premium: { type: Number, default: 5 },
    gold: { type: Number, default: 10 }
  },
  maxRenewals: {
    basic: { type: Number, default: 1 },
    premium: { type: Number, default: 2 },
    gold: { type: Number, default: 3 }
  },
  membershipFees: {
    basic: { type: Number, default: 0 },
    premium: { type: Number, default: 499 },
    gold: { type: Number, default: 999 }
  },
  workingHours: {
    type: String,
    default: 'Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 5:00 PM'
  },
  aboutText: {
    type: String,
    default: 'Welcome to our library management system.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
