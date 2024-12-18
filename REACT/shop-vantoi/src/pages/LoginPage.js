import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

        localStorage.setItem("user", JSON.stringify(userData));

        setMessage(data.message || "Đăng nhập thành công!");

        setIsLoggedIn(true);

        if (userData && userData.role !== undefined) {
          if (userData.role === 1) {
            navigate("/admin/dashboard");
          } else if (userData.role === 0) {
            navigate("/");
          }
        } else {
          setError("Dữ liệu người dùng không hợp lệ");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="login-form shadow p-4 rounded">
        {message && !error && (
          <div className="alert alert-success">{message}</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <h2 className="text-center mb-4">Đăng nhập</h2>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              required
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
    </div>
  );
};

export default LoginPage;
