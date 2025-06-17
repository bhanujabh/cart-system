import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import ProductListingPage from './pages/ProductListingPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ShippingPage from './pages/ShippingPage';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <nav style={{ padding: '10px', display: 'flex', gap: '10px' }}>
            <Link to="/">Products</Link>
            <Link to="/auth">Login/Register</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/shipping">Shipping</Link>
          </nav>

          <Routes>
            <Route path="/" element={<ProductListingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={<CartPage />} />

            <Route path="/checkout" element={
              <ProtectedRoute><CheckoutPage /></ProtectedRoute>
            }/>

            <Route path="/shipping" element={
              <ProtectedRoute><ShippingPage /></ProtectedRoute>
            }/>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
// todo:
// Persist auth and cart in localStorage
//Add toast messages on login/cart actions
//Use axios interceptors to add token headers automatically