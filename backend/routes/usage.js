const router = require('express').Router();
const WaterUsage = require('../models/WaterUsage');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// Helper: today's date string
const today = () => new Date().toISOString().split('T')[0];

// GET /api/usage/today
router.get('/today', auth, async (req, res) => {
  try {
    const usage = await WaterUsage.findOne({ user: req.user._id, date: today() });
    res.json({ usage: usage || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/usage/week  — last 7 days
router.get('/week', auth, async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    const records = await WaterUsage.find({ user: req.user._id, date: { $in: days } });
    const map = Object.fromEntries(records.map(r => [r.date, r]));
    const result = days.map(d => map[d] || { date: d, shower:0,kitchen:0,laundry:0,drinking:0,toilet:0,total:0 });
    res.json({ week: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/usage/history?limit=30
router.get('/history', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const records = await WaterUsage.find({ user: req.user._id })
      .sort({ date: -1 }).limit(limit);
    res.json({ history: records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/usage  — save or update today's usage
router.post('/', auth, async (req, res) => {
  try {
    const { shower=0, kitchen=0, laundry=0, drinking=0, toilet=0, date } = req.body;
    const dateStr = date || today();

    let usage = await WaterUsage.findOne({ user: req.user._id, date: dateStr });
    if (usage) {
      Object.assign(usage, { shower, kitchen, laundry, drinking, toilet });
      await usage.save();
    } else {
      usage = await WaterUsage.create({ user: req.user._id, date: dateStr, shower, kitchen, laundry, drinking, toilet });
    }

    // Check against goal
    const goal = await Goal.findOne({ user: req.user._id });
    let alert = null;
    if (goal && usage.total > goal.dailyGoal) {
      alert = { type: 'over', message: `You used ${usage.total} L today — ${usage.total - goal.dailyGoal} L over your ${goal.dailyGoal} L goal!` };
    } else if (goal) {
      alert = { type: 'under', message: `Great job! You used ${usage.total} L today, within your ${goal.dailyGoal} L goal.` };
    }

    // Compare with yesterday
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const prevUsage = await WaterUsage.findOne({ user: req.user._id, date: yesterdayStr });
    let comparison = null;
    if (prevUsage) {
      const diff = usage.total - prevUsage.total;
      const pct = Math.abs(Math.round((diff / prevUsage.total) * 100));
      comparison = diff > 0
        ? { type: 'more', message: `You used ${pct}% more water than yesterday (${prevUsage.total} L).` }
        : { type: 'less', message: `Congratulations! You used ${pct}% less water than yesterday (${prevUsage.total} L).` };
    }

    res.json({ usage, alert, comparison });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
