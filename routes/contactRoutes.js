const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markRead, resolveContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markRead);
router.put('/:id/resolve', protect, adminOnly, resolveContact);

module.exports = router;
