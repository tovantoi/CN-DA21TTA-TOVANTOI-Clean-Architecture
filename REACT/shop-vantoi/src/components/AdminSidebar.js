import React from "react";
import "../pages/AdminCss/AdminSidebar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2>Admin Dashboard</h2>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Trang chủ
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/category"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Quản lí danh mục
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Quản lí sản phẩm
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Quản lí khách hàng
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/request-otp"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Thay đổi mật khẩu
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Đăng xuất
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
