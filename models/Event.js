const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  date: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
