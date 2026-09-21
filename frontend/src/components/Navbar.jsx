import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Layers, Menu, X } from 'lucide-react';

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
          <Layers size={22} color="var(--primary)" strokeWidth={2.5} />
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
          <li>
            <span
              className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => handleNav('admin')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: currentPage === 'admin' ? 'var(--primary)' : 'inherit', fontWeight: '600' }}
            >
              Admin Portal
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
            <ShoppingBag size={18} strokeWidth={2} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
