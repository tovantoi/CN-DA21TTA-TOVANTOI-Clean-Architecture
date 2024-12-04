import React from "react";
import { Link } from "react-router-dom";
import "../AdminCss/AdminDashboard.css"; 

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <h2>Admin Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin" className="menu-item">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="menu-item">
              Quản lý Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className="menu-item">
              Quản lý Đơn hàng
            </Link>
          </li>
          <li>
            <Link to="/admin/customers" className="menu-item">
              Quản lý Khách hàng
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className="menu-item">
              Báo cáo
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-content">
        <h1>Chào mừng đến với trang quản trị</h1>
        <p>Quản lý các chức năng liên quan đến cửa hàng thời trang của bạn.</p>
        {/* Thêm các chức năng admin khác vào đây */}
      </div>
    </div>
  );
};

export default AdminDashboard;
