const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Contact = require('../models/Contact');

exports.getStats = async (req, res) => {
  const [totalProducts, totalOrders, totalCategories, unreadContacts, orders] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Category.countDocuments({ isActive: true }),
    Contact.countDocuments({ isRead: false }),
    Order.find().populate('items.product', 'category tags'),
  ]);

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);

  // Category sales
  const categorySales = {};
  const tagSales = {};
  for (const order of orders) {
    for (const item of order.items) {
      if (item.product && item.product.category) {
        const catId = item.product.category.toString();
        categorySales[catId] = (categorySales[catId] || 0) + item.quantity;
      }
      if (item.product && item.product.tags) {
        for (const tag of item.product.tags) {
          tagSales[tag] = (tagSales[tag] || 0) + item.quantity;
        }
      }
    }
  }

  // Monthly revenue last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentOrders = orders.filter(o => new Date(o.createdAt) >= sixMonthsAgo);
  const monthlyRevenue = {};
  for (const order of recentOrders) {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount;
  }

  // Top products by sold
  const topProducts = await Product.find({ isActive: true }).sort('-sold').limit(5).select('name sold images');

  res.json({
    totalProducts, totalOrders, totalCategories, unreadContacts, totalRevenue,
    categorySales, tagSales, monthlyRevenue, topProducts,
    orderStatusCounts: {
      placed: orders.filter(o => o.orderStatus === 'placed').length,
      processing: orders.filter(o => o.orderStatus === 'processing').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    }
  });
};
