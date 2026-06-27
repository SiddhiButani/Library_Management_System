const express = require('express');
const router = express.Router();
const {
  getUsers, getUserById, updateProfile, updateUser,
  deleteUser, getUserStats, changePassword, upgradeMembership
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/stats', protect, admin, getUserStats);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/membership', protect, upgradeMembership);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
