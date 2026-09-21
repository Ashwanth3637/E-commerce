import React, { useState, useEffect } from 'react';
import { Mail, Package, FolderTree, LogOut, Eye, Trash2, Edit3, Plus, X } from 'lucide-react';

export default function AdminPage({ backendUrl, onProductChange }) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'enquiries' | 'products' | 'categories'
  const [activeTab, setActiveTab] = useState('enquiries');

  // Data States
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals / View details
  const [viewEnquiry, setViewEnquiry] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Simple Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 1,
    category_name: 'Ergonomic Furniture',
    price: '',
    short_description: '',
    description: '',
    image_url: '',
    stock_status: 'In Stock'
  });

  // Simple Category Form
  const [newCatName, setNewCatName] = useState('');

  // Load Data from Backend
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [enqRes, prodRes, catRes] = await Promise.all([
        fetch(`${backendUrl}/api/enquiries`),
        fetch(`${backendUrl}/api/products`),
        fetch(`${backendUrl}/api/categories`)
      ]);

      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadAdminData();
    }
  }, [isLoggedIn]);

  // Handle Escape key to close any open modal & lock background scroll
  useEffect(() => {
    const isAnyModalOpen = Boolean(viewEnquiry || showAddProduct);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (viewEnquiry) setViewEnquiry(null);
        if (showAddProduct) setShowAddProduct(false);
      }
    };

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewEnquiry, showAddProduct]);

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch(`${backendUrl}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem('isAdmin', 'true');
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.error || 'Invalid admin username or password.');
      }
    } catch {
      // Simple fallback
      if (username === 'admin' && password === 'admin123') {
        setIsLoggedIn(true);
        sessionStorage.setItem('isAdmin', 'true');
      } else {
        setLoginError('Invalid admin credentials.');
      }
    }
  };

  // Logout Function
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isAdmin');
    setViewEnquiry(null);
  };

  // Update Enquiry Status
  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const res = await fetch(`${backendUrl}/api/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setEnquiries(prev => prev.map(item => (item.id === enquiryId || item._id === enquiryId) ? { ...item, status: newStatus } : item));
        if (viewEnquiry) {
          setViewEnquiry(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Delete this customer enquiry?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/enquiries/${enquiryId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setEnquiries(prev => prev.filter(item => item.id !== enquiryId && item._id !== enquiryId));
        if (viewEnquiry) setViewEnquiry(null);
      }
    } catch (err) {
      console.error('Delete enquiry error:', err);
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please enter product name and price.');
      return;
    }

    try {
      const selectedCat = categories.find(c => Number(c.id) === Number(productForm.category_id));
      const payload = {
        ...productForm,
        category_name: selectedCat ? selectedCat.name : productForm.category_name
      };

      let url = `${backendUrl}/api/products`;
      let method = 'POST';

      if (editProduct) {
        const prodId = editProduct.id || editProduct._id;
        url = `${backendUrl}/api/products/${prodId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setShowAddProduct(false);
        setEditProduct(null);
        loadAdminData();
        if (onProductChange) onProductChange();
      }
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/products/${prodId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadAdminData();
        if (onProductChange) onProductChange();
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() })
      });

      if (res.ok) {
        setNewCatName('');
        loadAdminData();
        if (onProductChange) onProductChange();
      }
    } catch (err) {
      console.error('Add category error:', err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catIdentifier) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/categories/${catIdentifier}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c._id !== catIdentifier && c.id !== catIdentifier && c.name !== catIdentifier));
        loadAdminData();
        if (onProductChange) onProductChange();
      } else {
        alert('Failed to delete category.');
      }
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  // -------------------------------------------------------------
  // 1. SIMPLE ADMIN LOGIN PAGE
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="section-padding" style={{ backgroundColor: '#f8fafc', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="form-card" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginBottom: '20px' }}>
              Sign in to manage products and customer enquiries
            </p>

            {loginError && (
              <div className="alert-error" style={{ padding: '10px', fontSize: '13px', marginBottom: '14px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter admin username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. SIMPLE ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '85vh', paddingBottom: '50px' }}>
      {/* Admin Header */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>Admin Dashboard</h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Manage Store & Enquiries</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </section>

      {/* Admin Tabs */}
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <button
            className={`btn ${activeTab === 'enquiries' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('enquiries')}
          >
            <Mail size={14} /> Customer Enquiries ({enquiries.length})
          </button>
          <button
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={14} /> Products ({products.length})
          </button>
          <button
            className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('categories')}
          >
            <FolderTree size={14} /> Categories ({categories.length})
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        {/* --- TAB 1: CUSTOMER ENQUIRIES --- */}
        {activeTab === 'enquiries' && (
          <div className="form-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Customer Enquiries & Orders</h3>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading enquiries...</p>
            ) : enquiries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No customer enquiries received yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px' }}>Customer Name</th>
                      <th style={{ padding: '10px' }}>Email</th>
                      <th style={{ padding: '10px' }}>Phone</th>
                      <th style={{ padding: '10px' }}>Subject / Type</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id || enq._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{enq.customer_name}</td>
                        <td style={{ padding: '10px' }}>{enq.email}</td>
                        <td style={{ padding: '10px' }}>{enq.phone || '-'}</td>
                        <td style={{ padding: '10px' }}>
                          {enq.items && enq.items.length > 0 ? (
                            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Cart ({enq.items.length} items)</span>
                          ) : (
                            <span>{enq.subject}</span>
                          )}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: enq.status === 'Completed' ? '#dcfce7' : enq.status === 'Contacted' ? '#e0f2fe' : '#fef3c7',
                            color: enq.status === 'Completed' ? '#166534' : enq.status === 'Contacted' ? '#0369a1' : '#b45309'
                          }}>
                            {enq.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ marginRight: '6px' }}
                            onClick={() => setViewEnquiry(enq)}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEnquiry(enq.id || enq._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: PRODUCTS MANAGEMENT --- */}
        {activeTab === 'products' && (
          <div className="form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Products List</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditProduct(null);
                  setProductForm({
                    name: '',
                    category_id: categories[0]?.id || 1,
                    category_name: categories[0]?.name || 'Ergonomic Furniture',
                    price: '',
                    short_description: '',
                    description: '',
                    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
                    stock_status: 'In Stock'
                  });
                  setShowAddProduct(true);
                }}
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Product Name</th>
                    <th style={{ padding: '10px' }}>Category</th>
                    <th style={{ padding: '10px' }}>Price</th>
                    <th style={{ padding: '10px' }}>Stock</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id || p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.name}</td>
                      <td style={{ padding: '10px' }}>{p.category_name}</td>
                      <td style={{ padding: '10px', color: 'var(--primary)', fontWeight: 'bold' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px' }}>{p.stock_status || 'In Stock'}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ marginRight: '6px' }}
                          onClick={() => {
                            setEditProduct(p);
                            setProductForm({
                              name: p.name || '',
                              category_id: p.category_id || 1,
                              category_name: p.category_name || 'General',
                              price: p.price || '',
                              short_description: p.short_description || '',
                              description: p.description || '',
                              image_url: p.image_url || '',
                              stock_status: p.stock_status || 'In Stock'
                            });
                            setShowAddProduct(true);
                          }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(p.id || p._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: CATEGORIES --- */}
        {activeTab === 'categories' && (
          <div className="form-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Category Management</h3>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter new category name..."
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Add Category
              </button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Category Name</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                  {categories.map((c) => (
                    <tr key={c.id || c._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px', fontWeight: '500' }}>{c.name}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(c._id || c.id || c.name)}
                          title="Delete Category"
                          style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- SIMPLE MODAL: VIEW ENQUIRY DETAILS --- */}
      {viewEnquiry && (
        <div className="modal-overlay" onClick={() => setViewEnquiry(null)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewEnquiry(null)}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Customer Enquiry Details</h3>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '14px', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}><strong>Customer:</strong> {viewEnquiry.customer_name}</p>
              <p style={{ margin: '4px 0' }}><strong>Email:</strong> {viewEnquiry.email}</p>
              <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {viewEnquiry.phone || 'Not provided'}</p>
              <p style={{ margin: '4px 0' }}><strong>Subject:</strong> {viewEnquiry.subject}</p>
              <p style={{ margin: '4px 0' }}><strong>Status:</strong> {viewEnquiry.status || 'Pending'}</p>
            </div>

            {/* If Cart Items exist */}
            {viewEnquiry.items && viewEnquiry.items.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>Ordered / Requested Products:</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                  {viewEnquiry.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      <strong>{item.product_name}</strong> — Qty: {item.quantity} (₹{item.unit_price} each)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirement Message */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Requirement / Message:</h4>
              <p style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', fontSize: '13px', margin: 0 }}>
                {viewEnquiry.message}
              </p>
            </div>

            {/* Update Status */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Change Status:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Pending', 'Contacted', 'Quotation Sent', 'Completed'].map((st) => (
                  <button
                    key={st}
                    className={`btn btn-sm ${viewEnquiry.status === st ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusChange(viewEnquiry.id || viewEnquiry._id, st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMPLE MODAL: ADD / EDIT PRODUCT --- */}
      {showAddProduct && (
        <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddProduct(false)}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Ergonomic Office Chair"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={productForm.category_id}
                  onChange={(e) => {
                    const cid = e.target.value;
                    const cat = categories.find(c => Number(c.id) === Number(cid));
                    setProductForm({ ...productForm, category_id: cid, category_name: cat ? cat.name : 'General' });
                  }}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  placeholder="e.g. 14999"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Product details..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddProduct(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
