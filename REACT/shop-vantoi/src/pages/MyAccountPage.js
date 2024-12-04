import React, { useEffect, useState } from "react";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.CustomerId) {
          throw new Error("Người dùng chưa đăng nhập.");
        }

        const userId = userData.CustomerId;

        const response = await fetch(
          `https://localhost:7022/minimal/api/get-customer-by-id?id=${userId}`
        );

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin tài khoản.");
        }

        const data = await response.json();

        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    };

    fetchCustomerById();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/update-profile-customer", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.CustomerId,
            name: formData.name,
            email: formData.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Cập nhật thông tin thất bại.");
      }

      setUser(formData);
      localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      setIsEditing(false);
      alert("Thông tin cá nhân đã được cập nhật!");
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!user) {
    return (
      <div className="container mt-5">Đang tải thông tin tài khoản...</div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Tài khoản của tôi</h2>
      <div className="card p-3">
        {!isEditing ? (
          <>
            <h4>Thông tin cá nhân</h4>
            <p>
              <strong>Tên:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa thông tin
            </button>
          </>
        ) : (
          <>
            <h4>Chỉnh sửa thông tin</h4>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <button className="btn btn-success me-2" onClick={handleSave}>
              Lưu
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
