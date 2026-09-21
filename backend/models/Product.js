const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_id: { type: Number, default: 1 },
  category_name: { type: String, default: 'General' },
  short_description: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String },
  stock_status: { type: String, default: 'In Stock' },
  specifications: { type: String },
  featured: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema, 'products');
