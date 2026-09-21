import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Package, 
  FolderTree, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  FileText, 
  Search, 
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminPage({ backendUrl, onProductChange }) {
  const [activeTab, setActiveTab] = useState('enquiries'); // 'dashboard', 'enquiries', 'products', 'categories'
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0
  });

  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter & Search states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [productModal, setProductModal] = useState({ open: false, mode: 'add', product: null });
  const [categoryModal, setCategoryModal] = useState(false);

  // Form states for Product Add/Edit
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 1,
    category_name: 'Ergonomic Furniture',
    price: '',
    short_description: '',
    description: '',
    image_url: '',
    stock_status: 'In Stock',
    specifications: '',
    featured: 0
  });

  // Form state for Category Add
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, enqRes, prodRes, catRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/stats`),
        fetch(`${backendUrl}/api/enquiries`),
        fetch(`${backendUrl}/api/products`),
        fetch(`${backendUrl}/api/categories`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // --- ENQUIRY ACTIONS ---
  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const res = await fetch(`${backendUrl}/api/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showNotification('success', `Enquiry status updated to "${newStatus}"`);
        setEnquiries(prev => prev.map(e => (e.id === enquiryId || e._id === enquiryId) ? { ...e, status: newStatus } : e));
        if (selectedEnquiry && (selectedEnquiry.id === enquiryId || selectedEnquiry._id === enquiryId)) {
          setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
        }
        // update stats
        const statsRes = await fetch(`${backendUrl}/api/admin/stats`);
        if (statsRes.ok) setStats(await statsRes.json());
      } else {
        showNotification('error', 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error');
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/enquiries/${enquiryId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification('success', 'Enquiry deleted successfully');
        setEnquiries(prev => prev.filter(e => e.id !== enquiryId && e._id !== enquiryId));
        if (selectedEnquiry && (selectedEnquiry.id === enquiryId || selectedEnquiry._id === enquiryId)) {
          setSelectedEnquiry(null);
        }
        fetchData();
      } else {
        showNotification('error', 'Failed to delete enquiry');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error');
    }
  };

  // --- PRODUCT ACTIONS ---
  const handleOpenAddProduct = () => {
    const defaultCat = categories[0] || { id: 1, name: 'Ergonomic Furniture' };
    setProductForm({
      name: '',
      category_id: defaultCat.id,
      category_name: defaultCat.name,
      price: '',
      short_description: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
      stock_status: 'In Stock',
      specifications: 'Warranty: 2 Years | High Durability Material',
      featured: 0
    });
    setProductModal({ open: true, mode: 'add', product: null });
  };

  const handleOpenEditProduct = (prod) => {
    setProductForm({
      name: prod.name || '',
      category_id: prod.category_id || 1,
      category_name: prod.category_name || 'General',
      price: prod.price || '',
      short_description: prod.short_description || '',
      description: prod.description || '',
      image_url: prod.image_url || '',
      stock_status: prod.stock_status || 'In Stock',
      specifications: prod.specifications || '',
      featured: prod.featured || 0
    });
    setProductModal({ open: true, mode: 'edit', product: prod });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Product Name and Price are mandatory.');
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

      if (productModal.mode === 'edit' && productModal.product) {
        const prodId = productModal.product.id || productModal.product._id;
        url = `${backendUrl}/api/products/${prodId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotification('success', `Product ${productModal.mode === 'edit' ? 'updated' : 'created'} successfully!`);
        setProductModal({ open: false, mode: 'add', product: null });
        fetchData();
        if (onProductChange) onProductChange();
      } else {
        showNotification('error', 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/products/${prodId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification('success', 'Product deleted successfully');
        fetchData();
        if (onProductChange) onProductChange();
      } else {
        showNotification('error', 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error');
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });

      if (res.ok) {
        showNotification('success', 'Category added successfully');
        setCategoryForm({ name: '', description: '' });
        setCategoryModal(false);
        fetchData();
      } else {
        showNotification('error', 'Failed to add category');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete this category? Products linked to it will remain.')) return;
    try {
      const res = await fetch(`${backendUrl}/api/categories/${catId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification('success', 'Category deleted');
        fetchData();
      } else {
        showNotification('error', 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error');
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = enquiryStatusFilter === 'All' || enq.status === enquiryStatusFilter;
    const matchesQuery = searchQuery === '' || 
      (enq.customer_name && enq.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (enq.email && enq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (enq.subject && enq.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
      case 'New':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Pending</span>;
      case 'Contacted':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0f2fe', color: '#0284c7' }}><PhoneCall size={12} /> Contacted</span>;
      case 'Quotation Sent':
        return <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#b45309' }}><FileText size={12} /> Quotation Sent</span>;
      case 'Completed':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Completed</span>;
      default:
        return <span className="badge badge-neutral">{status || 'Pending'}</span>;
    }
  };

  return (
    <div className="admin-page" style={{ backgroundColor: '#f8fafc', minHeight: '85vh', paddingBottom: '60px' }}>
      {/* Top Header */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                Admin Portal
              </span>
              <span className="badge badge-primary" style={{ fontSize: '11px' }}>Apex Management</span>
            </div>
            <h1 style={{ fontSize: '26px', marginTop: '2px', marginBottom: 0 }}>Company Management Dashboard</h1>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={fetchData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Data
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {message.text && (
        <div className="container" style={{ marginTop: '16px' }}>
          <div className={message.type === 'success' ? 'alert-success' : 'alert-error'} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', overflowX: 'auto' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={15} /> Overview
          </button>
          <button 
            className={`btn ${activeTab === 'enquiries' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('enquiries')}
          >
            <Mail size={15} /> Customer Enquiries ({stats.totalEnquiries})
            {stats.pendingEnquiries > 0 && (
              <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '11px', padding: '1px 6px', borderRadius: '10px', marginLeft: '4px' }}>
                {stats.pendingEnquiries}
              </span>
            )}
          </button>
          <button 
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={15} /> Products ({products.length})
          </button>
          <button 
            className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('categories')}
          >
            <FolderTree size={15} /> Categories ({categories.length})
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '24px' }}>
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>TOTAL PRODUCTS</span>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>{stats.totalProducts}</div>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '12px', width: '100%' }} onClick={() => setActiveTab('products')}>
                  Manage Products →
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>CATEGORIES</span>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>{stats.totalCategories}</div>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '12px', width: '100%' }} onClick={() => setActiveTab('categories')}>
                  View Categories →
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>TOTAL ENQUIRIES</span>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '4px' }}>{stats.totalEnquiries}</div>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '12px', width: '100%' }} onClick={() => setActiveTab('enquiries')}>
                  View All Enquiries →
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', borderLeft: '4px solid #f59e0b' }}>
                <span style={{ fontSize: '13px', color: '#b45309', fontWeight: '600' }}>PENDING ENQUIRIES</span>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#b45309', marginTop: '4px' }}>{stats.pendingEnquiries}</div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '12px', width: '100%' }} onClick={() => { setActiveTab('enquiries'); setEnquiryStatusFilter('Pending'); }}>
                  Process Pending →
                </button>
              </div>
            </div>

            {/* Recent Enquiries Teaser */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px' }}>Recent Customer Enquiries</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('enquiries')}>View Full Table</button>
              </div>

              {enquiries.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No customer enquiries yet. Enquiries submitted on the website will show here.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px' }}>Customer</th>
                        <th style={{ padding: '10px' }}>Type / Subject</th>
                        <th style={{ padding: '10px' }}>Products</th>
                        <th style={{ padding: '10px' }}>Status</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.slice(0, 5).map((enq) => (
                        <tr key={enq.id || enq._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <strong>{enq.customer_name}</strong>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{enq.email} | {enq.phone}</div>
                          </td>
                          <td style={{ padding: '12px 10px' }}>{enq.subject}</td>
                          <td style={{ padding: '12px 10px' }}>
                            {enq.items && enq.items.length > 0 ? (
                              <span className="badge badge-primary">{enq.items.length} Product(s)</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>General Message</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px' }}>{getStatusBadge(enq.status)}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setSelectedEnquiry(enq)}>
                              <Eye size={13} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ENQUIRIES MANAGEMENT ⭐ */}
        {activeTab === 'enquiries' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Customer Enquiries & Quotation Requests</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  Review incoming requests from the Contact page and Cart submissions, view details, and change status.
                </p>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search enquiries..."
                    className="form-control"
                    style={{ paddingLeft: '30px', width: '200px', fontSize: '13px', height: '34px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="form-control"
                  style={{ width: '150px', fontSize: '13px', height: '34px' }}
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius)' }}>
                <Mail size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                <h4>No enquiries found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>There are currently no enquiries matching your filter.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <th style={{ padding: '12px 10px' }}>Customer Name</th>
                      <th style={{ padding: '12px 10px' }}>Contact Info</th>
                      <th style={{ padding: '12px 10px' }}>Enquiry Subject</th>
                      <th style={{ padding: '12px 10px' }}>Products / Cart</th>
                      <th style={{ padding: '12px 10px' }}>Date</th>
                      <th style={{ padding: '12px 10px' }}>Status</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id || enq._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 10px', fontWeight: '600' }}>
                          {enq.customer_name}
                        </td>
                        <td style={{ padding: '12px 10px', fontSize: '13px' }}>
                          <div>{enq.email}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{enq.phone || 'No phone'}</div>
                        </td>
                        <td style={{ padding: '12px 10px', fontSize: '13px' }}>
                          {enq.subject}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {enq.items && enq.items.length > 0 ? (
                            <span className="badge badge-primary" style={{ fontSize: '12px' }}>
                              {enq.items.length} Product(s)
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Direct Message</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {getStatusBadge(enq.status)}
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setSelectedEnquiry(enq)}
                              title="View details"
                            >
                              <Eye size={13} /> View
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteEnquiry(enq.id || enq._id)}
                              title="Delete enquiry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Products Catalogue Management</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  Add, edit, or remove workspace products stored in MongoDB database.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleOpenAddProduct}>
                <Plus size={15} /> Add New Product
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <th style={{ padding: '12px 10px' }}>Product</th>
                    <th style={{ padding: '12px 10px' }}>Category</th>
                    <th style={{ padding: '12px 10px' }}>Price</th>
                    <th style={{ padding: '12px 10px' }}>Stock Status</th>
                    <th style={{ padding: '12px 10px' }}>Featured</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id || prod._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                          />
                          <div>
                            <strong style={{ fontSize: '14px' }}>{prod.name}</strong>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.short_description || prod.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '12px' }}>
                          {prod.category_name}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '600' }}>
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge badge-success" style={{ fontSize: '11px' }}>
                          {prod.stock_status || 'In Stock'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        {prod.featured === 1 ? (
                          <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '12px' }}>★ Featured</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleOpenEditProduct(prod)}
                            title="Edit product"
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProduct(prod.id || prod._id)}
                            title="Delete product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Product Categories</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  Manage store category taxonomy.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setCategoryModal(true)}>
                <Plus size={15} /> Add Category
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 10px' }}>ID</th>
                    <th style={{ padding: '12px 10px' }}>Category Name</th>
                    <th style={{ padding: '12px 10px' }}>Description</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id || cat._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>#{cat.id}</td>
                      <td style={{ padding: '12px 10px', fontWeight: '600' }}>{cat.name}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        {cat.description || 'Standard workspace category'}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(cat.id || cat._id)}
                          title="Delete category"
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
      </div>

      {/* --- MODAL: VIEW ENQUIRY DETAILS --- */}
      {selectedEnquiry && (
        <div className="modal-backdrop" onClick={() => setSelectedEnquiry(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEnquiry(null)}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>
                Customer Enquiry Details
              </span>
              {getStatusBadge(selectedEnquiry.status)}
            </div>

            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>{selectedEnquiry.subject}</h2>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>Customer Name</span>
                  <strong>{selectedEnquiry.customer_name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>Email Address</span>
                  <a href={`mailto:${selectedEnquiry.email}`} style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>Phone Number</span>
                  <strong>{selectedEnquiry.phone || 'Not provided'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>Received On</span>
                  <span>{selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleString('en-IN') : 'Recent'}</span>
                </div>
              </div>
            </div>

            {/* Requested Products list (if from Cart) */}
            {selectedEnquiry.items && selectedEnquiry.items.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Requested Products ({selectedEnquiry.items.length})</h4>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Product</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Est. Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEnquiry.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '8px 12px', fontWeight: '500' }}>{item.product_name}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{Number(item.unit_price).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customer Message / Requirement */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Requirement / Message</h4>
              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status Changer Buttons */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Update Enquiry Workflow Status:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className={`btn btn-sm ${selectedEnquiry.status === 'Pending' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleUpdateStatus(selectedEnquiry.id || selectedEnquiry._id, 'Pending')}
                >
                  <Clock size={13} /> Pending
                </button>
                <button
                  className={`btn btn-sm ${selectedEnquiry.status === 'Contacted' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleUpdateStatus(selectedEnquiry.id || selectedEnquiry._id, 'Contacted')}
                >
                  <PhoneCall size={13} /> Contacted
                </button>
                <button
                  className={`btn btn-sm ${selectedEnquiry.status === 'Quotation Sent' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleUpdateStatus(selectedEnquiry.id || selectedEnquiry._id, 'Quotation Sent')}
                >
                  <FileText size={13} /> Quotation Sent
                </button>
                <button
                  className={`btn btn-sm ${selectedEnquiry.status === 'Completed' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleUpdateStatus(selectedEnquiry.id || selectedEnquiry._id, 'Completed')}
                >
                  <CheckCircle size={13} /> Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT PRODUCT --- */}
      {productModal.open && (
        <div className="modal-backdrop" onClick={() => setProductModal({ open: false, mode: 'add', product: null })}>
          <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProductModal({ open: false, mode: 'add', product: null })}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
              {productModal.mode === 'edit' ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Apex Dual Motor Desk"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                    placeholder="e.g. 18999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Short Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brief one-line summary"
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Full Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Detailed specifications and features..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Stock Status</label>
                  <select
                    className="form-control"
                    value={productForm.stock_status}
                    onChange={(e) => setProductForm({ ...productForm, stock_status: e.target.value })}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Featured on Home</label>
                  <select
                    className="form-control"
                    value={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: Number(e.target.value) })}
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes (Featured Product)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Key Specifications</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dimensions: 140x70cm | Weight Capacity: 120kg"
                  value={productForm.specifications}
                  onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setProductModal({ open: false, mode: 'add', product: null })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {productModal.mode === 'edit' ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD CATEGORY --- */}
      {categoryModal && (
        <div className="modal-backdrop" onClick={() => setCategoryModal(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCategoryModal(false)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Add New Product Category</h2>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Ergonomic Footrests"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brief description..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
