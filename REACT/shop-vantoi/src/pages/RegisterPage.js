import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/register-customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(
          data.message || "Đăng ký thành công. Vui lòng kiểm tra email."
        );
        setError("");
        setStep(2);
      } else {
        setError(data.message || "Đăng ký thất bại.");
        setMessage("");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/authen-customer?email=${formData.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Xác thực OTP thành công!");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError(data.message || "Xác thực OTP thất bại.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="register-form shadow-lg p-5 rounded bg-white w-100"
        style={{ maxWidth: "400px" }}
      >
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRegister}>
            <h2 className="text-center mb-4 text-primary">Đăng kí</h2>
            <div className="mb-3">
              <label className="form-label">Họ</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
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
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="card-footer text-center mt-3">
              <small className="text-muted">
                Bạn đã có tài khoản?{" "}
                <a href="/login" className="text-decoration-none">
                  Đăng nhập
                </a>
              </small>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Đăng ký
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-center mb-4 text-primary">Xác Thực OTP</h2>
            <div className="mb-3">
              <label className="form-label">Nhập mã OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Xác thực
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
