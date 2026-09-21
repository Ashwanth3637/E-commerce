const mongoose = require('mongoose');

const enquiryItemSchema = new mongoose.Schema({
  product_id: { type: String },
  product_name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit_price: { type: Number, default: 0 }
});

const enquirySchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true },
  status: { type: String, default: 'New' },
  items: [enquiryItemSchema],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema, 'enquiries');
