const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  type: { type: String, enum: ['issue', 'order_inquiry'], required: true },
  subject: String,
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
