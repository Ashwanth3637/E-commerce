# Apex Workspace - Company Product & Enquiry E-Commerce System

A clean, modern, and beginner-friendly Company Product Catalogue & Enquiry website built with **React (Vite) + Plain CSS** on the frontend and **Node.js + Express + SQLite** on the backend.

---

## ⚡ Run Frontend & Backend Automatically (Single Command)

From the project root folder (`e-commerce/`), simply run:

```bash
npm run dev
```

> 🚀 **That's it!** This single command starts both the **Express Backend (`http://localhost:5001`)** and **React Frontend (`http://localhost:5173`)** concurrently with live reloading!

---

## 📁 Project Structure

```text
e-commerce/
├── backend/
│   ├── data/
│   │   └── database.sqlite       # SQLite database file
│   ├── routes/
│   │   ├── productRoutes.js      # Products & categories API endpoints
│   │   ├── enquiryRoutes.js      # Customer enquiry submission API
│   │   └── authRoutes.js         # User registration & login API
│   ├── db.js                     # SQLite connection & table schema initialization
│   ├── seed.js                   # Initial sample product catalogue data
│   ├── server.js                 # Express application entry point (Port 5001)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Sticky navigation bar with live cart badge
│   │   │   ├── Footer.jsx        # Company info, quick links, category links
│   │   │   ├── ProductCard.jsx   # Clean product card with price and actions
│   │   │   └── ProductModal.jsx  # Product detail modal with specs and quantity selector
│   │   ├── context/
│   │   │   └── CartContext.jsx   # Cart state with localStorage persistence
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero banner, featured products, company intro, benefits
│   │   │   ├── AboutPage.jsx     # Who We Are, Mission, Vision, Core Values
│   │   │   ├── ProductsPage.jsx  # Search bar, category filter tabs, product grid
│   │   │   ├── CartPage.jsx      # Item table, quantity controls, totals & quotation form
│   │   │   ├── ContactPage.jsx   # Office details, interactive enquiry form
│   │   │   ├── LoginPage.jsx     # Customer account login
│   │   │   ├── RegisterPage.jsx  # New user account registration
│   │   │   └── AccountPage.jsx   # Profile details & customer enquiry history
│   │   ├── App.jsx               # Page router & state coordinator
│   │   ├── main.jsx              # App entry point wrapped with CartProvider
│   │   └── index.css             # Vanilla CSS design system & responsive media queries
│   ├── index.html
│   ├── vite.config.js            # Automatic proxy configured for /api -> localhost:5001
│   └── package.json
│
├── package.json                  # Root runner script
└── README.md
```

---

## 🔌 Automatic API Proxy

Vite is configured in `frontend/vite.config.js` to automatically forward all `/api/*` requests to `http://localhost:5001`.

```javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
```

This means your React code simply calls `fetch('/api/products')` or `fetch('/api/enquiries')` seamlessly without worrying about ports or CORS!
