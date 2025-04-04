const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { authMiddleware } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User registration
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = new User({ email, password, role });
    await user.save();
    const token = await user.generateAuthToken();
    
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // In production: Send email with reset token
    const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.send({ 
      message: 'Password reset link sent to email',
      resetToken // In real app, this would be sent via email
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Protected test route
router.get('/me', authMiddleware, async (req, res) => {
  res.send(req.user);
});

module.exports = router;