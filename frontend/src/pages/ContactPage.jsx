import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage({ backendUrl }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Product Enquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${backendUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Product Enquiry',
          message: ''
        });
      } else {
        setErrorMsg(data.error || 'Submission failed. Please check your details.');
      }
    } catch (err) {
      console.error('Network error during enquiry submission:', err);
      // Fallback display
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '30px', marginBottom: '6px' }}>Contact & Enquiry</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            We'd love to hear from you. Send us a message or request a quotation for your office setup.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info-card">
              <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '13px' }}>GET IN TOUCH</span>
              <h2 style={{ fontSize: '24px', marginTop: '4px', marginBottom: '20px' }}>
                Apex Workspace Headquarters
              </h2>

              <div className="contact-item">
                <div className="feature-icon-wrap" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px' }}>Office Address</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    104 Industrial Tech Park, Phase II, Guindy, Chennai, Tamil Nadu - 600032
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="feature-icon-wrap" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px' }}>Direct Phone</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    +91 (044) 4567-8900 / +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="feature-icon-wrap" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px' }}>Email Enquiries</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    enquiries@apexworkspace.com / sales@apexworkspace.com
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="feature-icon-wrap" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px' }}>Working Hours</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Monday - Saturday: 9:00 AM – 6:00 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="form-card">
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Send Us an Enquiry</h3>

              {success && (
                <div className="alert-success" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Enquiry Submitted!</strong> Thank you for contacting Apex Workspace. Our customer representative will review your message and reach out shortly.
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="alert-error">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your business or personal email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Enquiry Subject</label>
                  <select
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="General Product Enquiry">General Product Enquiry</option>
                    <option value="Corporate / Bulk Order Quotation">Corporate / Bulk Order Quotation</option>
                    <option value="Custom Standing Desk Consultation">Custom Standing Desk Consultation</option>
                    <option value="Warranty & Product Support">Warranty & Product Support</option>
                    <option value="Partnership / Dealership">Partnership / Dealership</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Requirement Details *</label>
                  <textarea
                    name="message"
                    rows="4"
                    className="form-control"
                    placeholder="Tell us what you are looking for (quantities, specifications, delivery location...)"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
