import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose, onGoToCart }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

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
          ✕
        </button>

        <div className="modal-grid">
          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="modal-img"
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
            <span className="stock-tag">✓ {product.stock_status || 'In Stock'}</span>

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
                {addedNotice ? '✓ Added to Cart!' : 'Add to Cart'}
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
