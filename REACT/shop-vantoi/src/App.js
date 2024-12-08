import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import CustomerManagement from "./pages/Admin/CustomerManagement";
import RequestOtpPage from "./pages/RequestOtpPage"; // Import trang OTP
import ChangePasswordPage from "./pages/ChangePasswordPage"; // Import trang đổi mật khẩu

const App = () => {
  const [cart, setCart] = useState([]);
  const [emailForOtp, setEmailForOtp] = useState(""); // Trạng thái lưu email cho trang đổi mật khẩu

  // Load cart từ localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save cart vào localStorage khi thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Bảo vệ route admin
  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== 1) {
      // Nếu không có user hoặc user không phải admin, điều hướng đến trang login
      return <Navigate to="/login" />;
    }

    return children; // Trả về component con nếu có quyền truy cập
  };

  return (
    <Router>
      <Header cart={cart} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
        <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} />
        <Route path="/request-otp" element={<RequestOtpPage setEmailForOtp={setEmailForOtp} />} />
        <Route path="/change-password" element={<ChangePasswordPage email={emailForOtp} />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
