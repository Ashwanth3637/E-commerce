import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function ProductsPage({ products, categories, onSelectProduct }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products locally for instantaneous smooth search
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'all' || product.category_id === Number(selectedCategory);

    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.short_description && product.short_description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '30px', marginBottom: '6px' }}>Product Catalogue</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Explore our curated selection of ergonomic furniture, smart lighting, and workspace essentials.
          </p>
        </div>
      </section>

      {/* Catalogue Content */}
      <section className="section-padding">
        <div className="container">
          {/* Filter and Search Bar */}
          <div className="filter-bar">
            {/* Search Input */}
            <input
              type="text"
              placeholder="🔍 Search products by name, feature..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Category Tabs */}
            <div className="category-tabs">
              <button
                className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Products ({products.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`tab-btn ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(String(cat.id))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                We couldn't find any products matching your search criteria. Try clearing the filter.
              </p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
