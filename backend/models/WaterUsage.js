const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:    { type: String, required: true }, // YYYY-MM-DD
  shower:  { type: Number, default: 0 },
  kitchen: { type: Number, default: 0 },
  laundry: { type: Number, default: 0 },
  drinking:{ type: Number, default: 0 },
  toilet:  { type: Number, default: 0 },
  total:   { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

usageSchema.index({ user: 1, date: 1 }, { unique: true });

usageSchema.pre('save', function(next) {
  this.total = (this.shower || 0) + (this.kitchen || 0) + (this.laundry || 0) +
               (this.drinking || 0) + (this.toilet || 0);
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('WaterUsage', usageSchema);
