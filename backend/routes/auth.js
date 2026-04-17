const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
// Mock authentication that returns a user or creates one if it doesn't exist.
router.post('/login', async (req, res) => {
  try {
    const { username, role } = req.body;
    
    if (!username || !role) {
      return res.status(400).json({ error: 'Username and role are required' });
    }

    let user = await User.findOne({ username });
    
    if (!user) {
      // Create a mock user
      user = new User({ username, role });
      await user.save();
    } else {
      // Always sync the selected role for this demo
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
