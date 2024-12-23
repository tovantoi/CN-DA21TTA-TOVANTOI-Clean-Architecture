import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
      const swalInstance = Swal.fire({
        title: "Đang tải thông tin tài khoản...",
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
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.id) {
          throw new Error("Người dùng chưa đăng nhập.");
        }

        const userId = userData.id;

        const response = await fetch(
          `https://localhost:7022/minimal/api/get-customer-by-id?id=${userId}`
        );

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin tài khoản.");
        }

        const data = await response.json();
        console.log("API Response:", data);
        console.log("User from LocalStorage:", localStorage.getItem("user"));

        // Kiểm tra `isSuccess`
        if (!data.isSuccess) {
          throw new Error(data.message || "Không thể lấy thông tin tài khoản.");
        }

        // Gán thông tin khách hàng vào state
        setUser(data.data);
        swalInstance.close();
        setFormData({
          name: data.data.firstName || "",
          email: data.data.email || "",
        });
      } catch (err) {
        console.error("Error fetching customer by ID:", err);
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        swalInstance.close();
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
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData.id;

      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        imageData: formData.imageData || null, // Base64 của ảnh
      };

      const response = await fetch(
        `https://localhost:7022/minimal/api/update-profile-customer?id=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.isSuccess) {
        throw new Error(result.message || "Cập nhật thông tin thất bại.");
      }

      const updatedUser = {
        ...userData,
        ...updatedData,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      alert(result.message || "Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
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
              <strong>Avatar:</strong>{" "}
              <img
                src={
                  user.avatarImagePath && user.avatarImagePath !== "string"
                    ? `https://localhost:7241/${user.avatarImagePath}`
                    : "https://via.placeholder.com/100"
                }
                alt="Thumbnail"
                className="img-thumbnail"
                style={{ width: "60px", height: "60px" }}
              />
            </p>
            <p>
              <strong>Họ và tên:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {user.phoneNumber || "Chưa cập nhật"}
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
              <label htmlFor="firstName" className="form-label">
                Họ
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Tên
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
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
            <div className="mb-3">
              <label htmlFor="imageData" className="form-label">
                Ảnh đại diện
              </label>
              <input
                type="file"
                id="imageData"
                name="imageData"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setFormData({
                        ...formData,
                        imageData: event.target.result,
                      });
                    };
                    reader.readAsDataURL(file); // Đọc file và chuyển thành Base64
                  }
                }}
                className="form-control"
              />
            </div>
            <button className="btn btn-success" onClick={handleSave}>
              Lưu
            </button>
            <br></br>
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
