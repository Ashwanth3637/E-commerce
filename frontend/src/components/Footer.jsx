import React from 'react';
import { Layers, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer({ navigateTo }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Brief */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#ffffff', fontWeight: 'bold', fontSize: '16px' }}>
              <Layers size={20} color="var(--primary-light)" />
              <span>Apex Workspace Solutions</span>
            </div>
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
              <li><a onClick={() => navigateTo('admin')} style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Admin Portal (Management)</a></li>
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
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--primary-light)' }} />
                <span>104 Industrial Tech Park, Guindy, Chennai</span>
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--primary-light)' }} />
                <span>+91 (044) 4567-8900</span>
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={16} style={{ flexShrink: 0, color: 'var(--primary-light)' }} />
                <span>enquiries@apexworkspace.com</span>
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Clock size={16} style={{ flexShrink: 0, color: 'var(--primary-light)' }} />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
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
