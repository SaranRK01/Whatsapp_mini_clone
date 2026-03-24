const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getMe,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateRegister } = require('../middleware/validate');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', protect, getAllUsers);
router.get('/me', protect, getMe);
router.get('/:id', protect, getUserById);

module.exports = router;
