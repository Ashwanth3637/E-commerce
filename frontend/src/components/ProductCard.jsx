import React from 'react';
import { useCart } from '../context/CartContext';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card" onClick={() => onViewDetails(product)}>
      <div className="product-image-wrap">
        <img
          src={product.image_url || DEFAULT_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        {product.category_name && (
          <span className="category-badge">{product.category_name}</span>
        )}
      </div>

      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.short_description || product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div className="product-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
            >
              Details
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
