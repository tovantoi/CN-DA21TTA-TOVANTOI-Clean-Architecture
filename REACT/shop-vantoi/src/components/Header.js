import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ cart }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin người dùng

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Nếu có thông tin người dùng, lưu vào state
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-name-product?productname=${encodeURIComponent(
          searchQuery
        )}`
      );

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Cập nhật lại trạng thái người dùng
    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="logo animated-logo">
          <img
            src="/assets/logoo.png"
            alt="Logo"
            className="me-2"
            style={{ height: "70px" }}
          />
          <Link to="/" className="text-decoration-none fs-3">
            <span className="logo-text">
              SHOP <b>VANTOI</b>
            </span>
          </Link>
        </div>

        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a href="/products" className="nav-link text-dark">
                <b> Hàng mới</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="/products" className="nav-link text-dark">
                <b>Sản phẩm</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="#phukien" className="nav-link text-dark">
                <b>Phụ kiện</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link text-dark">
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
            🔍
          </button>
          {error && <div className="invalid-feedback">{error}</div>}

          <div className="account-dropdown position-relative ms-3">
            <button className="btn btn-light">
              <span role="img" aria-label="account">
                👤
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
                    <button
                      onClick={handleLogout}
                      className="dropdown-item btn btn-link text-start"
                    >
                      Đăng xuất
                    </button>
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
                      Tạo tài khoản
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <Link to="/cart" className="btn btn-primary position-relative ms-3">
              🛒 Giỏ hàng
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
