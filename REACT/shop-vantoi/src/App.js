import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import Dashboard from "./pages/Admin/Dashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import AddProduct from "./pages/Admin/AddProduct";
import CustomerManagement from "./pages/Admin/CustomerManagement";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import AddCategory from "./pages/Admin/AddCategory";
import EditCategory from "./pages/Admin/EditCategory";
import ProductEditPage from "./pages/Admin/ProductEditPage";
import RequestOtpPage from "./pages/RequestOtpPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminLayout from "./components/AdminLayout";
import {
  Chart,
  CategoryScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, ArcElement, BarElement, Tooltip, Legend);

const AppContent = ({ cart, setCart, emailForOtp, setEmailForOtp }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== 1) {
      // Điều hướng đến trang login nếu không phải admin
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div>
      {!isAdminRoute && <Header cart={cart} />}{" "}
      {/* Hiển thị Header nếu không phải admin */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
        <Route
          path="/product/:productId"
          element={
            <ProductDetail
              addToCart={(product) => setCart((prev) => [...prev, product])}
            />
          }
        />
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/category" element={<CategoryManagement />} />
          <Route path="/admin/add-category" element={<AddCategory />} />
          <Route path="/admin/edit-category/:id" element={<EditCategory />} />
          <Route
            path="/admin/editproducts/:productId"
            element={<ProductEditPage />}
          />
          <Route
            path="/admin/request-otp"
            element={<RequestOtpPage setEmailForOtp={setEmailForOtp} />}
          />
          <Route
            path="/change-password"
            element={<ChangePasswordPage email={emailForOtp} />}
          />
        </Route>
        <Route
          path="/request-otp"
          element={<RequestOtpPage setEmailForOtp={setEmailForOtp} />}
        />
        <Route
          path="/change-password"
          element={<ChangePasswordPage email={emailForOtp} />}
        />
      </Routes>
      {!isAdminRoute && <Footer />} {/* Hiển thị Footer nếu không phải admin */}
    </div>
  );
};

const App = () => {
  const [cart, setCart] = useState([]);
  const [emailForOtp, setEmailForOtp] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <Router>
      <AppContent
        cart={cart}
        setCart={setCart}
        emailForOtp={emailForOtp}
        setEmailForOtp={setEmailForOtp}
      />
    </Router>
  );
};

export default App;
