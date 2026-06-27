const Settings = require('../models/Settings');

const calculateFine = async (dueDate, returnDate) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    
    // Calculate difference in days
    const diffTime = returned.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 0;
    
    const fineAmount = diffDays * settings.finePerDay;
    return Math.min(fineAmount, settings.maxFineAmount);
  } catch (error) {
    console.error('Fine calculation error:', error);
    return 0;
  }
};

const getBorrowDuration = async (membershipType) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings.borrowDuration[membershipType] || 14;
  } catch (error) {
    return 14;
  }
};

const getMaxBooks = async (membershipType) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings.maxBooks[membershipType] || 3;
  } catch (error) {
    return 3;
  }
};

const getMaxRenewals = async (membershipType) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings.maxRenewals[membershipType] || 1;
  } catch (error) {
    return 1;
  }
};

module.exports = { calculateFine, getBorrowDuration, getMaxBooks, getMaxRenewals };
