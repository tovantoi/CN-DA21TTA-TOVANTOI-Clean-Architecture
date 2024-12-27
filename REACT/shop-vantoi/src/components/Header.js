import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaSearch, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { AiOutlineHome, AiOutlineUnorderedList } from "react-icons/ai";

const Header = ({ cart }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const swalInstance = Swal.fire({
      title: "Đang tải trang...",
      width: 600,
      padding: "3em",
      color: "#716add",
      background: "#fff",
      backdrop: `
                    rgba(0,0,123,0.4)
                    url("/assets/loading.png")
                    left top
                    no-repeat
                  `,
      allowOutsideClick: false, // Ngăn người dùng đóng alert bằng cách click bên ngoài
      showConfirmButton: false,
    });
    const timeoutId = setTimeout(() => {
      swalInstance.close();
    }, 1000);
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng từ localStorage:", error);
      swalInstance.close();
      setUser(null);
    }
  }, []);
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }
    try {
      const swalInstance = Swal.fire({
        title: "Đang lấy dữ liệu...",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff",
        backdrop: `
                      rgba(0,0,123,0.4)
                      url("/assets/loading.png")
                      left top
                      no-repeat
                    `,
      });
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-name-product?productname=${encodeURIComponent(
          searchQuery
        )}`
      );
      swalInstance.close();
      if (!response.ok) {
        if (response.status === 404) {
          setError("Không tìm thấy sản phẩm nào phù hợp.");
          swalInstance.close();
        } else {
          throw new Error("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.");
        }
        return;
      }

      const data = await response.json();
      setError("");
      navigate("/search-results", {
        state: { results: data, query: searchQuery },
      });
    } catch (error) {
      setError(
        error.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại."
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
    <header className="bg-white shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="logo animated-logo">
          <Link to="/">
            <img
              src="/assets/logoo.png"
              alt="Logo"
              className="me-2"
              style={{
                height: "80px",
                borderRadius: "5px",
                borderTopRightRadius: "50px",
                paddingRight: "10px",
              }}
            />
          </Link>
          <Link to="/" className="text-decoration-none fs-3">
            <motion.span
              className="logo-text"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1, // Logo sẽ xuất hiện rõ ràng
                scale: 1, // Phóng to logo khi xuất hiện
                rotate: [0, 15, -15, 0], // Thêm hiệu ứng quay nhẹ
                x: [15, 10, -10, -15], // Thêm hiệu ứng lắc lư (xây qua lại)
              }}
              transition={{
                duration: 1,
                delay: 0, // Delay 1 giây trước khi hiệu ứng bắt đầu
                repeat: Infinity, // Lặp lại vô hạn
                repeatType: "reverse", // Lặp lại theo chiều ngược lại
                repeatDelay: 5, // Thời gian nghỉ giữa các lần lặp (10 giây)
                ease: "easeInOut",
              }}
              style={{
                display: "inline-block",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ff6ec7, #ff9000)", // Gradient cho chữ
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textTransform: "uppercase",
              }}
            >
              SHOP <b>VANTOI</b>
            </motion.span>
          </Link>
        </div>

        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a href="/products" className="nav-link">
                <b>Sản phẩm</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="/phukien" className="nav-link">
                <b>Phụ kiện</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="/blogpage" className="nav-link">
                <b>Blog</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">
                <b>Liên hệ</b>
              </a>
            </li>
          </ul>
        </nav>

        <div className="d-flex align-items-center">
          <input
            type="text"
            className={`form-control me-2 ${error ? "is-invalid" : ""}`}
            placeholder="Bạn tìm gì?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-dark" onClick={handleSearch}>
            <FaSearch size={20} style={{ color: "blue" }} />
          </button>
          {error && <div className="invalid-feedback">{error}</div>}

          <div className="account-dropdown position-relative ms-3">
            <button className="btn btn-light">
              <span role="img" aria-label="account">
                <FaUserCircle
                  color="blue"
                  size={40}
                  style={{ marginRight: "8px" }}
                />
              </span>
            </button>
            <ul
              className="dropdown-menu position-absolute bg-white shadow"
              style={{ right: 0, top: "100%", zIndex: 1000 }}
            >
              {user ? (
                <>
                  <li>
                    <Link to="/my-account" className="dropdown-item">
                      Tài khoản của tôi
                    </Link>
                  </li>
                  <li>
                    <Link to="/request-otp" className="dropdown-item">
                      Thay đổi mật khẩu
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/logout"
                      className="nav-link"
                      onClick={showConfirmDialog}
                    >
                      <b>Đăng xuất</b>
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="dropdown-item">
                      Đăng nhập
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="dropdown-item">
                      Đăng kí
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <Link to="/cart" className="btn btn-primary position-relative ms-3">
              <FaShoppingCart
                color="white"
                size={20}
                style={{ marginRight: "8px" }}
              />
              Giỏ hàng
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
