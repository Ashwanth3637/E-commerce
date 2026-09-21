import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

const BACKEND_URL = '';

// Initial fallback products in case backend is loading
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Ergonomic Furniture',
    name: 'ProErgo Executive Mesh Chair',
    short_description: 'Breathable mesh chair with 3D lumbar support and adjustable armrests.',
    description: 'Engineered for all-day comfort, the ProErgo Executive Mesh Chair features dynamic lumbar support, breathable Korean mesh, 4D adjustable armrests, and a 135-degree recline mechanism with tilt lock.',
    price: 14999,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Material: Breathable Mesh | Max Weight: 150 kg | Warranty: 3 Years | Color: Charcoal Gray',
    featured: 1
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Ergonomic Furniture',
    name: 'Apex Motorized Standing Desk',
    short_description: 'Dual-motor height adjustable desk with 4 memory presets.',
    description: 'The Apex Standing Desk is crafted from solid sustainable hardwood and powered by dual ultra-quiet motors. Supports seamless transition from sitting to standing with digital LED control.',
    price: 28499,
    image_url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Height Range: 65cm - 125cm | Tabletop: 140x70cm Walnut | Motor: Dual Ultra-quiet | Load: 120 kg',
    featured: 1
  },
  {
    id: 3,
    category_id: 2,
    category_name: 'Office Tech & Gadgets',
    name: 'UltraWide Monitor Arm Mount',
    short_description: 'Heavy-duty gas spring arm for 17" to 38" screens.',
    description: 'Free up desk space with precision counterbalance gas-spring movement. Features 360-degree rotation, 90-degree swivel, and built-in cable management channels.',
    price: 3499,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Screen Support: 17"-38" | Weight Capacity: Up to 12 kg | VESA: 75x75, 100x100 | Tilt: -45° to +90°',
    featured: 1
  },
  {
    id: 4,
    category_id: 3,
    category_name: 'Lighting & Ambiance',
    name: 'Lumina Smart Desk Lamp Pro',
    short_description: 'Eye-care LED desk lamp with auto-dimming and wireless charging base.',
    description: 'Designed to protect your eyes during long working hours. Features full spectrum CRI > 95 LEDs, step-less color temperature tuning (2700K-6500K), and integrated 15W Qi wireless charger.',
    price: 2499,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Color Temp: 2700K - 6500K | CRI: Ra > 95 | Wireless Charging: 15W Qi Fast Charge | Power: 18W USB-C',
    featured: 1
  },
  {
    id: 5,
    category_id: 4,
    category_name: 'Desk Accessories',
    name: 'Felt & Cork Desk Mat (Large)',
    short_description: 'Water-resistant eco-friendly desk pad for keyboard & mouse.',
    description: 'Crafted from premium merino wool felt with natural non-slip cork base. Protects your desk surface while providing a smooth glide for optical mice and comfortable wrist support.',
    price: 899,
    image_url: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Dimensions: 900mm x 400mm x 4mm | Material: Wool Felt + Organic Cork | Water Resistant: Yes',
    featured: 0
  },
  {
    id: 6,
    category_id: 2,
    category_name: 'Office Tech & Gadgets',
    name: 'StreamCast 4K Ultra HD Webcam',
    short_description: 'AI noise-canceling dual microphones with auto-focus HDR.',
    description: 'Crisp 4K 60fps video quality for conference calls, streaming, and remote collaboration. Includes physical privacy shutter and magnetic monitor mount.',
    price: 6799,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Resolution: 4K 30fps / 1080p 60fps | Field of View: 90° | Mic: Dual Stereo Noise-Canceling | Connection: USB-C Plug & Play',
    featured: 0
  },
  {
    id: 7,
    category_id: 4,
    category_name: 'Desk Accessories',
    name: 'Solid Walnut Headphone Stand',
    short_description: 'Handcrafted solid wood headphone display stand with brass accents.',
    description: 'Keep your workspace tidy and your headphones in top shape. Designed with a curved top to preserve headphone headband shape.',
    price: 1299,
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Material: Solid American Walnut + Matte Brass | Weight: 450g | Base: Non-scratch silicone feet',
    featured: 0
  },
  {
    id: 8,
    category_id: 3,
    category_name: 'Lighting & Ambiance',
    name: 'ScreenBar Monitor Light Bar',
    short_description: 'Asymmetric optical design screen lamp with touch controls.',
    description: 'Illuminates the desk area without causing glare or reflections on your computer screen. Saves precious desktop space by mounting securely on top of any monitor.',
    price: 3199,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    stock_status: 'In Stock',
    specifications: 'Mounting: Universal Clip (1-3cm thickness) | Color Temp: 3000K-6000K | Powered by: 5V 1A USB | Auto Dimming: Yes',
    featured: 1
  }
];

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Ergonomic Furniture' },
  { id: 2, name: 'Office Tech & Gadgets' },
  { id: 3, name: 'Lighting & Ambiance' },
  { id: 4, name: 'Desk Accessories' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch live products and categories from backend
  const loadData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/products`),
        fetch(`${BACKEND_URL}/api/categories`)
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        }
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData && catData.length > 0) {
          setCategories(catData);
        }
      }
    } catch (err) {
      console.log('Using local fallback product data', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
      />

      {/* Main Page Routing */}
      <main style={{ flexGrow: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            products={products}
            navigateTo={navigateTo}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage navigateTo={navigateTo} />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            products={products}
            categories={categories}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            navigateTo={navigateTo}
            backendUrl={BACKEND_URL}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            backendUrl={BACKEND_URL}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            backendUrl={BACKEND_URL}
            onProductChange={loadData}
          />
        )}
      </main>

      {/* Product Detail Modal */}
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

      {/* Footer */}
      <Footer navigateTo={navigateTo} />
    </div>
  );
}
