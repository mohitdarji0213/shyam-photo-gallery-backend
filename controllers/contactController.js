const Contact = require('../models/Contact');
const sendEmail = require('../config/email');

exports.submitContact = async (req, res) => {
  const { name, email, phone, type, subject, message } = req.body;
  const contact = await Contact.create({ name, email, phone, type, subject, message });

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New ${type === 'issue' ? 'Issue' : 'Order Inquiry'} from ${name} | Shyam Photo Gallery`,
    html: `<h3>${type === 'issue' ? 'Support Issue' : 'Order Inquiry'}</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`
  });

  await sendEmail({
    to: email,
    subject: `Aapka message mil gaya - Shyam Photo Gallery`,
    html: `<h2>Namaste ${name}!</h2><p>Aapka message humein mil gaya hai. Hum jald hi aapse contact karenge.</p><p>- Monika Sharma<br>Shyam Photo Gallery</p>`
  });

  res.status(201).json({ message: 'Message sent successfully', id: contact._id });
};

exports.getContacts = async (req, res) => {
  const { type, isRead } = req.query;
  const query = {};
  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead === 'true';
  const contacts = await Contact.find(query).sort('-createdAt');
  res.json(contacts);
};

exports.markRead = async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
};

exports.resolveContact = async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { isResolved: true });
  res.json({ message: 'Resolved' });
};
