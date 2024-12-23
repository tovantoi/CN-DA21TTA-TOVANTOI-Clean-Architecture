import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component được render
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    }
  }, []); // Chỉ chạy khi component mount

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/login-customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.isSuccess) {
        const userData = data.query;

        localStorage.setItem("user", JSON.stringify(userData)); // Lưu thông tin vào localStorage
        // setMessage(data.message || "Đăng nhập thành công!");
        setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
        Swal.fire({
          title: "Đăng nhập thành công!",
          text: data.message || "Chào mừng bạn!",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (userData.role === 1) {
          navigate("/admin/dashboard");
        } else if (userData.role === 0) {
          navigate("/");
        }
      } else {
        Swal.fire({
          title: "Đăng nhập thất bại",
          text: data.message || "Vui lòng kiểm tra lại thông tin đăng nhập.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Lỗi kết nối",
        text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="login-form card shadow-lg p-4 rounded border-0"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4 text-primary">Đăng nhập</h2>
          {message && !error && (
            <div className="alert alert-success">{message}</div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
                placeholder="Nhập email của bạn"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                required
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
        <div className="card-footer text-center mt-3">
          <small className="text-muted">
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-decoration-none">
              Đăng ký
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
