const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getEvents);
router.post('/', protect, adminOnly, upload.single('image'), createEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
