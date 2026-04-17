const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

// POST /api/moods - Create a mood entry
router.post('/', async (req, res) => {
  try {
    const { userId, role, mood, note } = req.body;
    if (!userId || !mood) {
      return res.status(400).json({ error: 'userId and mood are required' });
    }

    const newMood = new Mood({ userId, mood, note });
    await newMood.save();
    
    // Return populated user info if needed, but for now just the mood
    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/moods - Get Mood Entries
router.get('/', async (req, res) => {
  try {
    const { userId, role } = req.query;

    let query = {};
    if (role === 'user') {
      if (!userId) return res.status(400).json({ error: 'userId required for user role' });
      query.userId = userId;
      // User only gets latest 10
      const moods = await Mood.find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'username');
      return res.json(moods);
    } else if (role === 'admin') {
      // Admin gets all entries
      const moods = await Mood.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'username');
      return res.json(moods);
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/moods/:id - Delete Mood Entry (Admin Only)
router.delete('/:id', async (req, res) => {
  try {
    const { role } = req.body; // In a real app this would be inside a JWT
    const { id } = req.params;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    await Mood.findByIdAndDelete(id);
    res.json({ message: 'Mood deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
