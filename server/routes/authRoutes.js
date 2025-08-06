// authRoutes.js
const express = require('express');
const {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    requestPasswordReset,
    resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Update user details
router.put('/update', updateUser);

// Delete user
router.delete('/delete', deleteUser);

// Request password reset
router.post('/request-password-reset', requestPasswordReset);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
