import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/customer-logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Đăng xuất thành công!");
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("user");

        // Chuyển hướng đến trang đăng nhập hoặc trang chủ
        navigate("/login");
      } else {
        alert(data.message || "Đăng xuất thất bại!");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Đăng xuất
    </button>
  );
};

export default Logout;
