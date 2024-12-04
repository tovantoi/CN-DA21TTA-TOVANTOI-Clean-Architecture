import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
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
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import CustomerManagement from "./pages/Admin/CustomerManagement";

const App = () => {
  const [cart, setCart] = useState([]); // Khai báo giỏ hàng

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      // Nếu sản phẩm chưa tồn tại, thêm mới
      return [...prevCart, { ...product, quantity: 1 }];
    });
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        {/*<Route path="/admin/cart" element={<CartManagement />} />*/}
        <Route path="/admin/customers" element={<CustomerManagement />} />
        {/* <Route path="/admin/product/:id" element={<ProductDetailAdmin />} />*/}
        <Route
          path="/product/:productId"
          element={<ProductDetail addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
