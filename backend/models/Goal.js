const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dailyGoal:  { type: Number, default: 150 }, // litres per day
  updatedAt:  { type: Date, default: Date.now },
});

goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
