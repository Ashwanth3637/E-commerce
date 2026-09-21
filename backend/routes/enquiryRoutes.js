const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// POST /api/enquiries - save general or cart enquiry in MongoDB
router.post('/enquiries', async (req, res) => {
  try {
    const { customer_name, email, phone, subject, message, items } = req.body;

    if (!customer_name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newEnquiry = new Enquiry({
      customer_name: customer_name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Enquiry',
      message: message.trim(),
      items: Array.isArray(items) ? items.map(item => ({
        product_id: String(item.id || ''),
        product_name: item.name || 'Product',
        quantity: item.quantity || 1,
        unit_price: item.price || 0
      })) : []
    });

    const saved = await newEnquiry.save();

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully! Our team will contact you shortly.',
      enquiryId: saved._id
    });
  } catch (error) {
    console.error('Error saving enquiry to MongoDB:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// GET /api/enquiries - retrieve recent enquiries from MongoDB
router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ created_at: -1 }).limit(50);
    const formatted = enquiries.map(e => ({
      ...e.toObject(),
      id: e._id
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching enquiries from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

module.exports = router;
