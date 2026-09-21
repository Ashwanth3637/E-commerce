import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentPage, navigateTo }) {
  const { getCartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = getCartCount();

  const handleNav = (page) => {
    navigateTo(page);
    setMobileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => handleNav('home')}>
          <span>🏢</span>
          <span>Apex Workspace</span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li>
            <span
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => handleNav('home')}
            >
              Home
            </span>
          </li>
          <li>
            <span
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => handleNav('about')}
            >
              About
            </span>
          </li>
          <li>
            <span
              className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
              onClick={() => handleNav('products')}
            >
              Products
            </span>
          </li>
          <li>
            <span
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => handleNav('contact')}
            >
              Contact / Enquiry
            </span>
          </li>
        </ul>

        {/* Actions (Cart & Mobile Menu) */}
        <div className="nav-actions">
          <button
            className="cart-btn"
            onClick={() => handleNav('cart')}
            title="View Shopping Cart"
          >
            <span>🛒 Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
