// client/src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import Navbar from "./components/Navbar/Navbar";
import useProducts from "./hooks/useProducts";

import PrivateRoute from "./auth/PrivateRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import "./App.css";

export default function App() {
  const products = useProducts();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (cart.some((item) => item._id === product._id)) {
      alert("Item already in the cart");
    } else {
      alert("Item added to cart");
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0);

  const handleQuantityChange = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, qty: newQuantity } : item
      )
    );
  };

  return (
    <>
      <Navbar cartItems={cart} />

      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home products={products} addToCart={addToCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                calculateTotalPrice={calculateTotalPrice}
                handleQuantityChange={handleQuantityChange}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Default: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
