const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://shyam-photo-gallery-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shyamphotogallery')
  .then(() => console.log('✅ MongoDB Connected - Shyam Photo Gallery'))
  .catch(err =>{ 
    console.error('❌ MongoDB Error:', err)});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
