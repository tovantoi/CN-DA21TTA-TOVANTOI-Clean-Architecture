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
import BlogPage from "./pages/BlogPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ProductDetail from "./components/ProductDetail";
import Phukien from "./components/Phukien";
import Logout from "./components/Logout";
import CartPage from "./pages/CartPage";
import Dashboard from "./pages/Admin/Dashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import AddProduct from "./pages/Admin/AddProduct";
import CustomerManagement from "./pages/Admin/CustomerManagement";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import CouponManagement from "./pages/Admin/CouponManagement";
import CategoryProductsPage from "./pages/Admin/CategoryProductsPage";
import AddCategory from "./pages/Admin/AddCategory";
import EditCategory from "./pages/Admin/EditCategory";
import OrderManagement from "./pages/Admin/OrderManagement";
import CreateCoupon from "./pages/Admin/CreateCoupon";
import OrderDetail from "./pages/Admin/OrderDetail";
import EditCoupon from "./pages/Admin/EditCoupon";
import CouponDetail from "./pages/Admin/CouponDetail";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProductEditPage from "./pages/Admin/ProductEditPage";
import RequestOtpPage from "./pages/RequestOtpPage";
import About from "./pages-footer/About";
import Stores from "./pages-footer/Stores";
import FAQ from "./pages-footer/FAQ";
import ShippingPolicy from "./pages-footer/ShippingPolicy";
import SizeGuide from "./pages-footer/SizeGuide";
import PaymentGuide from "./pages-footer/PaymentGuide";
import ExchangePolicy from "./pages-footer/ExchangePolicy";
import PurchaseGuide from "./pages-footer/PurchaseGuide";
import PrivacyPolicy from "./pages-footer/PrivacyPolicy";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminLayout from "./components/AdminLayout";
import OrderManagementPage from "./pages/OrderManagementPage";
import NotFoundPage from "./components/NotFoundPage";
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
  const definedRoutes = [
    "/", // Các route hợp lệ
    "/login",
    "/my-orders",
    "/order/:orderId",
    "/logout",
    "/register",
    "/my-account",
    "/products",
    "/contact",
    "/blogpage",
    "/phukien",
    "/search-results",
    "/checkout",
    "/product/:productId",
    "/cart",
    "/change-password",
    "/request-otp",
    "/about",
    "/stores",
    "/privacy-policy",
    "/faq",
    "/shipping-policy",
    "/size-guide",
    "/payment-guide",
    "/exchange-policy",
    "/purchase-guide",
  ];
  const isNotFound = !definedRoutes.some((route) =>
    new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`).test(location.pathname)
  );

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
      {!isAdminRoute && !isNotFound && <Header cart={cart} />}{" "}
      {/* Hiển thị Header nếu không phải admin */}
      <Routes>
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/my-orders" element={<OrderManagementPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blogpage" element={<BlogPage />} />
        <Route path="/phukien" element={<Phukien />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/payment-guide" element={<PaymentGuide />} />
        <Route path="/exchange-policy" element={<ExchangePolicy />} />
        <Route path="/purchase-guide" element={<PurchaseGuide />} />
        <Route
          path="/request-otp"
          element={<RequestOtpPage setEmailForOtp={setEmailForOtp} />}
        />
        <Route
          path="/change-password"
          element={<ChangePasswordPage email={emailForOtp} />}
        />
        <Route
          path="/checkout"
          element={<CheckoutPage cart={cart} setCart={setCart} />}
        />
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
          <Route path="/admin/order" element={<OrderManagement />} />
          <Route path="/admin/order-detail/:id" element={<OrderDetail />} />
          <Route path="/admin/coupon" element={<CouponManagement />} />
          <Route path="/admin/create-coupon" element={<CreateCoupon />} />
          <Route path="/admin/coupon-detail/:id" element={<CouponDetail />} />
          <Route path="/admin/editcoupon/:id" element={<EditCoupon />} />
          <Route
            path="/admin/category-products/:id"
            element={<CategoryProductsPage />}
          />
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
            path="/admin/change-password"
            element={<ChangePasswordPage email={emailForOtp} />}
          />
        </Route>
      </Routes>
      {!isAdminRoute && !isNotFound && <Footer />}{" "}
      {/* Hiển thị Footer nếu không phải admin */}
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
