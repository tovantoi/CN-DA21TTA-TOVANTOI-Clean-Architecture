import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RegisterPage = () => {
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP Verification
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(""); // OTP input
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Register
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
          data.message ||
            "Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP."
        );
        setError("");
        setStep(2); // Chuyển sang bước xác thực OTP
      } else {
        setError(data.message || "Đăng ký thất bại. Vui lòng kiểm tra lại.");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setMessage("");
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Mã OTP không hợp lệ. Vui lòng nhập lại mã OTP.");
      return;
    }

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
        setError("");

        // Chuyển hướng về trang đăng nhập sau 2 giây
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(data.message || "Xác thực OTP thất bại. Vui lòng thử lại.");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setMessage("");
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center">
      <div className="register-form shadow p-4 rounded">
        {/* Hiển thị thông báo thành công hoặc lỗi */}
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRegister}>
            <h2 className="text-center mb-4">Tạo tài khoản</h2>
            <div className="mb-3">
              <label>Họ</label>
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
              <label>Tên</label>
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
              <label>Email</label>
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
              <label>Password</label>
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
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Đăng ký
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-center mb-4">Xác thực OTP</h2>
            <div className="mb-3">
              <label>Nhập mã OTP</label>
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
