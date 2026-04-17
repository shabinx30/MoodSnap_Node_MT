const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const { userId, role } = req.query;

    let matchStage = {};
    
    if (role === 'user') {
      if (!userId) return res.status(400).json({ error: 'userId required for user role' });
      // Use mongoose.Types.ObjectId to explicitly cast
      const mongoose = require('mongoose');
      matchStage.userId = new mongoose.Types.ObjectId(userId);
    } else if (role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Group by mood type and count
    const stats = await Mood.aggregate([
      { $match: matchStage },
      { 
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format into a simpler object: { happy: 2, sad: 1, ... }
    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
