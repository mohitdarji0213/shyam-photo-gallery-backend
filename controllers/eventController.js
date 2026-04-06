const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  const events = await Event.find({ isActive: true }).sort('-createdAt').limit(5);
  res.json(events);
};

exports.createEvent = async (req, res) => {
  const { title, description, date } = req.body;
  const image = req.file ? req.file.path : '';
  const event = await Event.create({ title, description, date, image });
  res.status(201).json(event);
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Event deleted' });
};
