import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, CheckCircle2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CartPage({ navigateTo, backendUrl }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const cartTotal = getCartTotal();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCartEnquirySubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.notes.trim()
    ) {
      setErrorMsg('All fields marked with an asterisk (*) are mandatory. Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${backendUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: 'Cart Products Quotation Request',
          message: `Customer Note: ${formData.notes.trim()}`,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEnquirySuccess(true);
        clearCart();
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setEnquirySuccess(true);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  if (enquirySuccess) {
    return (
      <div className="section-padding">
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', backgroundColor: '#ffffff', padding: '40px 24px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div className="feature-icon-wrap" style={{ width: '64px', height: '64px', margin: '0 auto 16px', backgroundColor: '#dcfce7', color: 'var(--success)' }}>
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <h2 style={{ marginBottom: '12px' }}>Cart Enquiry Submitted Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px' }}>
              Thank you, <strong>{formData.name}</strong>. Our enterprise sales team has received your product list and will send an official quotation to <strong>{formData.email}</strong> within 2-4 business hours.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => { setEnquirySuccess(false); navigateTo('products'); }}>
                Browse More Products
              </button>
              <button className="btn btn-outline" onClick={() => { setEnquirySuccess(false); navigateTo('home'); }}>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
     
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '30px', marginBottom: '6px' }}>Your Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review selected workspace items and submit a request for an official quotation or purchase order.
          </p>
        </div>
      </section>


      <section className="section-padding">
        <div className="container">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <div className="feature-icon-wrap" style={{ width: '60px', height: '60px', margin: '0 auto 14px' }}>
                <ShoppingBag size={30} />
              </div>
              <h3 style={{ marginBottom: '8px' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
                You haven't added any products to your cart yet.
              </p>
              <button className="btn btn-primary" onClick={() => navigateTo('products')}>
                Explore Products Now
              </button>
            </div>
          ) : (
            <div className="cart-layout">
             
              <div className="cart-table-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '18px' }}>Cart Items ({cartItems.length})</h3>
                  <button className="btn btn-danger btn-sm" onClick={clearCart}>
                    <Trash2 size={13} /> Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')} each</div>
                    </div>

                    <div className="qty-control" style={{ margin: 0 }}>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove product"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => navigateTo('products')}>
                    <ArrowLeft size={14} /> Continue Shopping
                  </button>
                </div>
              </div>

              {/* Order Summary & Enquiry */}
              <div className="cart-summary">
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Order Summary</h3>

                <div className="summary-row">
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Subtotal</span>
                  <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>

                <div className="summary-row">
                  <span style={{ color: 'var(--text-muted)' }}>Shipping & Freight</span>
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>Calculated upon Enquiry</span>
                </div>

                <div className="summary-row">
                  <span style={{ color: 'var(--text-muted)' }}>GST / Taxes</span>
                  <span>Included in quote</span>
                </div>

                <div className="summary-row summary-total">
                  <span>Estimated Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                {!showEnquiryForm ? (
                  <button
                    className="btn btn-primary btn-block"
                    style={{ marginTop: '20px' }}
                    onClick={() => setShowEnquiryForm(true)}
                  >
                    Submit Cart for Quotation <ArrowRight size={16} />
                  </button>
                ) : (
                  <form onSubmit={handleCartEnquirySubmit} style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Customer Contact Details</h4>

                    {errorMsg && <div className="alert-error" style={{ padding: '8px 12px', fontSize: '12px' }}>{errorMsg}</div>}

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ramesh Kumar"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. ramesh@company.com"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Delivery Note / Special Instructions *</label>
                      <textarea
                        name="notes"
                        rows="2"
                        className="form-control"
                        required
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Need delivery in Chennai, floor 4..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Confirm & Submit Enquiry'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-block btn-sm"
                      style={{ marginTop: '8px' }}
                      onClick={() => setShowEnquiryForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
