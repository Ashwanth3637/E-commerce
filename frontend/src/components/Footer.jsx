import React from 'react';

export default function Footer({ navigateTo }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Brief */}
          <div className="footer-col">
            <h4>🏢 Apex Workspace Solutions</h4>
            <p>
              Delivering ergonomic office furniture, motorized standing desks, smart lighting, and modern workspace technology for progressive companies and remote professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a onClick={() => navigateTo('home')}>Home</a></li>
              <li><a onClick={() => navigateTo('about')}>About Us</a></li>
              <li><a onClick={() => navigateTo('products')}>Product Catalogue</a></li>
              <li><a onClick={() => navigateTo('cart')}>Shopping Cart</a></li>
              <li><a onClick={() => navigateTo('contact')}>Contact & Enquiry</a></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><a onClick={() => navigateTo('products')}>Ergonomic Furniture</a></li>
              <li><a onClick={() => navigateTo('products')}>Office Tech & Gadgets</a></li>
              <li><a onClick={() => navigateTo('products')}>Lighting & Ambiance</a></li>
              <li><a onClick={() => navigateTo('products')}>Desk Accessories</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-links">
              <li>📍 104 Industrial Tech Park, Guindy, Chennai</li>
              <li>📞 +91 (044) 4567-8900</li>
              <li>✉️ enquiries@apexworkspace.com</li>
              <li>🕒 Mon - Sat: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Apex Workspace Solutions Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
