const Product = require('../models/Product');
const slugify = require('slugify');

exports.getProducts = async (req, res) => {
  const { category, tag, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const query = { isActive: true };
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { tags: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);
  res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
};

exports.getNewProducts = async (req, res) => {
  const products = await Product.find({ isNew: true, isActive: true }).populate('category', 'name slug').limit(8).sort('-createdAt');
  res.json(products);
};

exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).populate('category', 'name slug').limit(8);
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const related = await Product.find({ tags: { $in: product.tags }, _id: { $ne: product._id }, isActive: true }).limit(8).populate('category', 'name slug');
  res.json({ product, related });
};

exports.createProduct = async (req, res) => {
  const { name, description, price, originalPrice, category, tags, stock, isNew, isFeatured } = req.body;
  const images = req.files ? req.files.map(f => f.path) : [];
  const slug = slugify(name, { lower: true }) + '-' + Date.now();
  const product = await Product.create({ name, slug, description, price, originalPrice, category, tags: tags ? tags.split(',').map(t => t.trim()) : [], stock, isNew, isFeatured, images });
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const updates = req.body;
  if (updates.tags && typeof updates.tags === 'string') updates.tags = updates.tags.split(',').map(t => t.trim());
  if (req.files && req.files.length > 0) updates.images = req.files.map(f => f.path);
  Object.assign(product, updates);
  await product.save();
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Product deleted' });
};

exports.searchProducts = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const products = await Product.find({
    isActive: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ]
  }).populate('category', 'name slug').limit(20);
  res.json(products);
};
