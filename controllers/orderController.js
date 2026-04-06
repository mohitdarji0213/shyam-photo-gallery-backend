const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../config/email');

exports.createOrder = async (req, res) => {
  const { customer, items, totalAmount, paymentMethod, notes } = req.body;
  const order = await Order.create({ customer, items, totalAmount, paymentMethod, notes });

  // Update sold count
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { sold: item.quantity } });
  }

  // Send confirmation email
  const itemsList = items.map(i => `<li>${i.name} x${i.quantity} - ₹${i.price}</li>`).join('');
  await sendEmail({
    to: customer.email,
    subject: `Order Confirmed - ${order.orderNumber} | Shyam Photo Gallery`,
    html: `<h2>Namaste ${customer.name}!</h2><p>Aapka order place ho gaya hai.</p><p>Order Number: <strong>${order.orderNumber}</strong></p><ul>${itemsList}</ul><p>Total: <strong>₹${totalAmount}</strong></p><p>Payment: ${paymentMethod}</p><p>- Monika Sharma, Shyam Photo Gallery</p>`
  });

  // Notify admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Order - ${order.orderNumber}`,
    html: `<h3>New Order Received!</h3><p>Customer: ${customer.name} (${customer.phone})</p><p>Address: ${customer.address}</p><ul>${itemsList}</ul><p>Total: ₹${totalAmount}</p><p>Payment: ${paymentMethod}</p>`
  });

  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const [orders, total] = await Promise.all([
    Order.find(query).populate('items.product', 'name images').sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)),
    Order.countDocuments(query),
  ]);
  res.json({ orders, total, pages: Math.ceil(total / limit) });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status, paymentStatus: req.body.paymentStatus }, { new: true });
  res.json(order);
};
