const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');

// GET /api/categories - get all categories from MongoDB
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ id: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - add a new category
router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Determine highest id
    const highest = await Category.findOne().sort({ id: -1 });
    const nextId = highest && highest.id ? highest.id + 1 : 1;

    const newCategory = new Category({
      id: nextId,
      name: name.trim(),
      description: description ? description.trim() : ''
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// DELETE /api/categories/:id - delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
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

// POST /api/products - add a new product
router.post('/products', async (req, res) => {
  try {
    const {
      name,
      category_id,
      category_name,
      short_description,
      description,
      price,
      image_url,
      stock_status,
      specifications,
      featured
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const newProduct = new Product({
      name: name.trim(),
      category_id: Number(category_id) || 1,
      category_name: category_name || 'General',
      short_description: short_description ? short_description.trim() : '',
      description: description ? description.trim() : '',
      price: Number(price),
      image_url: image_url || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
      stock_status: stock_status || 'In Stock',
      specifications: specifications ? specifications.trim() : '',
      featured: Number(featured) || 0
    });

    const saved = await newProduct.save();
    res.status(201).json({
      ...saved.toObject(),
      id: saved._id
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - update a product
router.put('/products/:id', async (req, res) => {
  try {
    const {
      name,
      category_id,
      category_name,
      short_description,
      description,
      price,
      image_url,
      stock_status,
      specifications,
      featured
    } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name ? name.trim() : undefined,
        category_id: category_id !== undefined ? Number(category_id) : undefined,
        category_name: category_name || undefined,
        short_description: short_description !== undefined ? short_description.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        price: price !== undefined ? Number(price) : undefined,
        image_url: image_url || undefined,
        stock_status: stock_status || undefined,
        specifications: specifications !== undefined ? specifications.trim() : undefined,
        featured: featured !== undefined ? Number(featured) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      ...updated.toObject(),
      id: updated._id
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET /api/admin/stats - get summary metrics
router.get('/admin/stats', async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalEnquiries, pendingEnquiries] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: { $in: ['Pending', 'New'] } })
    ]);

    res.json({
      totalProducts,
      totalCategories,
      totalEnquiries,
      pendingEnquiries
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
