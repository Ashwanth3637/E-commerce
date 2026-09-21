import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, PackageSearch, RotateCcw } from 'lucide-react';

export default function ProductsPage({ products, categories, onSelectProduct }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products locally for search
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
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '35px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '30px', marginBottom: '6px' }}>Product Catalogue</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
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
            <div style={{ position: 'relative', flex: 1, width: '100%', minWidth: '200px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search products by name, feature..."
                className="search-input"
                style={{ paddingLeft: '38px', width: '100%' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
              <button
                className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Sections ({categories.length})
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

          {/* If viewing All without search: Show section by section with 2 products each */}
          {selectedCategory === 'all' && searchQuery.trim() === '' ? (
            <div>
              {categories.map(cat => {
                const catProducts = products
                  .filter(p => p.category_id === cat.id)
                  .slice(0, 2); // Exactly 2 products per section

                if (catProducts.length === 0) return null;

                return (
                  <div key={cat.id} style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h2 style={{ fontSize: '20px', color: '#0f172a' }}>{cat.name}</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cat.description}</p>
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedCategory(String(cat.id))}
                      >
                        Filter {cat.name}
                      </button>
                    </div>

                    <div className="products-grid-medium">
                      {catProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onViewDetails={onSelectProduct}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* If a category is selected or searching */
            <div>
              <div style={{ marginBottom: '18px', color: 'var(--text-muted)', fontSize: '14px' }}>
                Showing <strong>{filteredProducts.slice(0, 2).length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="products-grid-medium">
                  {filteredProducts.slice(0, 2).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={onSelectProduct}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 16px', backgroundColor: '#ffffff', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                  <div className="feature-icon-wrap" style={{ width: '50px', height: '50px', margin: '0 auto 12px' }}>
                    <PackageSearch size={26} />
                  </div>
                  <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>No products found</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px' }}>
                    We couldn't find any products matching your search criteria. Try clearing the filter.
                  </p>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    <RotateCcw size={14} /> Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
