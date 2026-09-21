const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/categories - get all categories from MongoDB
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/products - get products with search, category, and featured filters from MongoDB
router.get('/products', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category_id = Number(category);
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { short_description: regex }
      ];
    }

    if (featured === '1' || featured === 'true') {
      filter.featured = 1;
    }

    const products = await Product.find(filter).sort({ _id: -1 });

    // Format products with convenient id
    const formatted = products.map(p => ({
      ...p.toObject(),
      id: p._id
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - get single product from MongoDB
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      ...product.toObject(),
      id: product._id
    });
  } catch (error) {
    console.error('Error fetching product by ID from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
