import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaSearch, FaUserCircle, FaShoppingCart } from "react-icons/fa";
const Header = ({ cart }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const swalInstance = Swal.fire({
      title: "Đang tải trang...",
      width: 600,
      padding: "3em",
      color: "#716add",
      background: "#fff",
      backdrop: `rgba(0,0,123,0.4) url("/assets/loading.png") left top no-repeat`,
      allowOutsideClick: false,
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

  const handleMenuClick = (item) => {
    setActiveItem(item); // Cập nhật trạng thái mục được chọn
  };

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
        backdrop: `rgba(0,0,123,0.4) url("/assets/loading.png") left top no-repeat`,
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
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user?.role;

      const response = await fetch(
        "https://localhost:7022/minimal/api/customer-logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
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
        localStorage.removeItem("user");
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
    e.preventDefault();

    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      text: "Bạn sẽ bị đăng xuất khỏi tài khoản hiện tại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  return (
    <header className="bg-light shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="logo animated-logo">
          <Link to="/">
            <motion.img
              src="/assets/logoo.png"
              alt="Logo"
              className="me-2"
              style={{
                height: "60px",
                borderRadius: "5px",
                paddingRight: "10px",
              }}
              initial={{ opacity: 0, scale: 0, rotate: -90 }} // Hiệu ứng khi xuất hiện: Mờ, nhỏ và xoay
              animate={{
                opacity: 1, // Hiển thị rõ ràng
                scale: [1, 1.2, 1], // Phóng to nhẹ rồi trở về kích thước ban đầu
                rotate: 0, // Quay về góc bình thường
              }}
              transition={{
                duration: 1.5, // Thời gian hiệu ứng
                ease: "easeOut", // Làm mềm chuyển động
              }}
              whileHover={{
                scale: 1.1, // Phóng to nhẹ khi hover
                rotate: [0, 5, -5, 0], // Lắc nhẹ khi hover
                boxShadow: "0px 0px 15px rgba(0, 0, 255, 0.5)", // Thêm bóng xanh khi hover
              }}
            />
          </Link>
          <Link to="/" className="text-decoration-none fs-3 text-dark">
            <motion.span
              className="logo-text"
              initial={{ opacity: 0, scale: 0, rotate: -90 }} // Xuất hiện từ nhỏ, quay 90 độ
              animate={{
                opacity: 1,
                scale: [1, 1.1, 1],
                rotate: 0,
                textShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
              }}
              transition={{
                duration: 1.5, // Thời gian hoàn thành hiệu ứng
                delay: 0.5, // Chậm trễ 0.5 giây
                ease: "easeOut", // Làm mượt hiệu ứng
              }}
              whileHover={{
                scale: 1.2, // Phóng to khi hover
                textShadow: "0px 0px 10px rgba(255, 255, 255, 1)", // Phát sáng khi hover
              }}
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                background: "linear-gradient(90deg, #ff6ec7, #f9d423, #1e90ff)", // Gradient màu
                WebkitBackgroundClip: "text", // Chỉ áp dụng gradient cho chữ
                WebkitTextFillColor: "transparent", // Làm chữ trong suốt
                textShadow: "0px 0px 2px rgba(255, 255, 255, 0.3)", // Ánh sáng nhẹ
                fontSize: "2rem", // Tăng kích thước chữ
                display: "inline-block",
              }}
            >
              SHOP <b>VANTOI</b>
            </motion.span>
          </Link>
        </div>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link
                to="/products"
                className={`nav-link ${
                  activeItem === "products" ? "active" : ""
                }`}
                onClick={() => handleMenuClick("products")}
              >
                Sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/phukien"
                className={`nav-link ${
                  activeItem === "phukien" ? "active" : ""
                }`}
                onClick={() => handleMenuClick("phukien")}
              >
                Phụ kiện
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/blogpage"
                className={`nav-link ${
                  activeItem === "blogpage" ? "active" : ""
                }`}
                onClick={() => handleMenuClick("blogpage")}
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link ${
                  activeItem === "contact" ? "active" : ""
                }`}
                onClick={() => handleMenuClick("contact")}
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>

        <div className="d-flex align-items-center">
          <motion.div
            className="d-flex align-items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <motion.input
              type="text"
              className={`form-control me-2 ${error ? "is-invalid" : ""}`}
              placeholder="Bạn tìm gì?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              whileFocus={{
                borderColor: "#1e90ff", // Màu viền xanh khi focus
                boxShadow: "0px 0px 8px rgba(30, 144, 255, 0.6)", // Hiệu ứng ánh sáng khi focus
                scale: 1.02, // Phóng to nhẹ khi focus
              }}
              animate={{
                x: error ? [0, -10, 10, 0] : 0, // Lắc nhẹ khi có lỗi
                borderColor: error ? "#dc3545" : "#ccc", // Màu viền đỏ khi lỗi
              }}
              transition={{
                x: { type: "spring", stiffness: 100 }, // Hiệu ứng lắc mềm mại
                duration: 0.5,
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "5px",
                outline: "none",
                borderWidth: "1px",
              }}
            />
          </motion.div>

          <button className="btn btn-primary" onClick={handleSearch}>
            <FaSearch />
          </button>
          <div className="ms-3">
            <Link to="/cart" className="btn btn-warning position-relative">
              <FaShoppingCart className="me-2" />
              Giỏ hàng
              <span className="badge bg-danger position-absolute">
                {cart.length}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
