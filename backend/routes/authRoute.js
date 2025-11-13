const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, handleChangePassword} = require('../controllers/authController');
const {authMiddleware} = require("../middleware/authMiddleware");

// Route for POST /api/auth/register
//router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/profile/:id', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, handleChangePassword)

module.exports = router;