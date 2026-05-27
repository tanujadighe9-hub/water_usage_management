const router = require('express').Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// GET /api/goal
router.get('/', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ user: req.user._id });
    res.json({ goal: goal || { dailyGoal: 150 } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/goal  — set or update daily goal
router.post('/', auth, async (req, res) => {
  try {
    const { dailyGoal } = req.body;
    if (!dailyGoal || dailyGoal < 1)
      return res.status(400).json({ message: 'Daily goal must be at least 1 litre' });

    let goal = await Goal.findOne({ user: req.user._id });
    if (goal) { goal.dailyGoal = dailyGoal; await goal.save(); }
    else goal = await Goal.create({ user: req.user._id, dailyGoal });

    res.json({ goal, message: `Daily goal set to ${dailyGoal} L!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
