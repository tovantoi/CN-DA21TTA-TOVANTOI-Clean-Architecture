import React from "react";
import "../pages/AdminCss/AdminSidebar.css";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/category"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lí danh mục
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lí sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lí khách hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/request-otp"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Thay đổi mật khẩu
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Đăng xuất
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
