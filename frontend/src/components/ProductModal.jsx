import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Check, ShoppingBag } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1580481077195-c9a9103c8091?auto=format&fit=crop&w=600&q=80';

export default function ProductModal({ product, onClose, onGoToCart }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Disable background scrolling & close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-grid">
          <div>
            <img
              src={product.image_url || DEFAULT_IMAGE}
              alt={product.name}
              className="modal-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          </div>

          <div className="modal-details">
            {product.category_name && (
              <span className="category-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '8px' }}>
                {product.category_name}
              </span>
            )}
            <h2>{product.name}</h2>
            <div className="modal-price">₹{product.price.toLocaleString('en-IN')}</div>
            <span className="stock-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Check size={13} strokeWidth={3} /> {product.stock_status || 'In Stock'}
            </span>

            <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>
              {product.description}
            </p>

            {product.specifications && (
              <div className="spec-list">
                <strong>Specifications:</strong>
                <p style={{ marginTop: '4px', color: '#334155' }}>{product.specifications}</p>
              </div>
            )}

            <div className="qty-control">
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Quantity:</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="qty-val">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>
                {addedNotice ? (
                  <>
                    <Check size={16} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
              <button className="btn btn-outline" onClick={onGoToCart}>
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
