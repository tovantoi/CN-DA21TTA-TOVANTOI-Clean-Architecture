import React from "react";
import "../pages/AdminCss/AdminSidebar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Lấy thông tin vai trò từ localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user?.role;

      const response = await fetch(
        "https://localhost:7022/minimal/api/customer-logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }), // Gửi vai trò cho API
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Đăng xuất thành công!",
          text: data.message || "Hẹn gặp lại!",
          icon: "success",
          confirmButtonText: "OK",
        });
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("user");

        // Điều hướng về trang đăng nhập
        navigate("/login");
      } else {
        Swal.fire({
          title: "Đăng xuất thất bại",
          text: data.message || "Vui lòng kiểm tra lại thông tin đăng nhập.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (err) {
      console.error("Error during logout:", err);
      Swal.fire({
        title: "Lỗi kết nối",
        text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const showConfirmDialog = (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      text: "Bạn sẽ bị đăng xuất khỏi tài khoản hiện tại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout(); // Gọi hàm đăng xuất khi người dùng xác nhận
      }
    });
  };
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
          <a href="/logout" className="nav-link" onClick={showConfirmDialog}>
            <b>Đăng xuất</b>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
