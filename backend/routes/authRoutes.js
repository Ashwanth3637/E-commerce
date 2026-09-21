const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      password: password,
      role: 'Customer'
    });

    const saved = await user.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        role: saved.role
      }
    });
  } catch (error) {
    console.error('Registration error in MongoDB:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error in MongoDB:', error);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

// POST /api/auth/admin-login - Dedicated admin authentication
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username/Email and Password are required.' });
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Built-in Master Admin Credentials
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@apexworkspace.com' || cleanUser === 'admin@gmail.com') &&
      (cleanPass === 'admin123' || cleanPass === 'admin@2026' || cleanPass === 'admin')
    ) {
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        admin: {
          name: 'Apex Administrator',
          email: 'admin@apexworkspace.com',
          role: 'Admin',
          token: 'apex-admin-session-token'
        }
      });
    }

    // 2. Database Admin User Check
    const dbAdmin = await User.findOne({ 
      email: cleanUser,
      role: 'Admin'
    });

    if (dbAdmin && dbAdmin.password === cleanPass) {
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        admin: {
          id: dbAdmin._id,
          name: dbAdmin.name,
          email: dbAdmin.email,
          role: 'Admin',
          token: 'apex-admin-session-token'
        }
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials. Please enter authorized username/password.' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed due to server error.' });
  }
});

module.exports = router;
