import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/categories`)
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch (err) {
      console.error('Failed to load products/categories:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />

      <main style={{ flexGrow: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            products={products}
            navigateTo={navigateTo}
            onSelectProduct={setSelectedProduct}
          />
        )}
        {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
        {currentPage === 'products' && (
          <ProductsPage
            products={products}
            categories={categories}
            onSelectProduct={setSelectedProduct}
          />
        )}
        {currentPage === 'cart' && <CartPage navigateTo={navigateTo} backendUrl={API_URL} />}
        {currentPage === 'contact' && <ContactPage backendUrl={API_URL} />}
        {currentPage === 'admin' && <AdminPage backendUrl={API_URL} onProductChange={loadData} />}
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onGoToCart={() => {
            setSelectedProduct(null);
            navigateTo('cart');
          }}
        />
      )}

      <Footer navigateTo={navigateTo} />
    </div>
  );
}

