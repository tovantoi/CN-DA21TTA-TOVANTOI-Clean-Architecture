import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    regularPrice: "",
    discountPrice: "",
    description: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    gender: "",
    packaging: "",
    origin: "",
    manufacturer: "",
    imageData: "",
    seoTitle: "",
    seoAlias: "",
    isActive: false,
    categoryIds: [],
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          imageData: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryIdsChange = (e) => {
    const ids = e.target.value
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));
    setFormData({ ...formData, categoryIds: ids });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Thêm thông báo "Đang gửi yêu cầu..." trong frontend
      setMessage("Đang gửi yêu cầu...");

      const response = await fetch(
        "https://localhost:7022/minimal/api/create-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Hiển thị thông báo thành công
        setMessage("Sản phẩm đã được thêm thành công.");
        setErrors([]); // Xóa lỗi nếu có

        // Sau khi thông báo thành công, reset form và xóa thông báo sau 3 giây
        setTimeout(() => {
          setFormData({
            productName: "",
            regularPrice: "",
            discountPrice: "",
            description: "",
            brand: "",
            size: "",
            color: "",
            material: "",
            gender: "",
            packaging: "",
            origin: "",
            manufacturer: "",
            imageData: "",
            seoTitle: "",
            seoAlias: "",
            isActive: false,
            categoryIds: [],
          });
          setMessage(""); // Xóa thông báo sau khi reload
          setErrors([]); // Xóa lỗi nếu có
        }, 5000); // Chờ 3 giây trước khi reset form và xóa thông báo
      } else {
        // Hiển thị thông báo lỗi
        setMessage("Thêm sản phẩm thất bại.");
        setErrors(result.errors || []); // Đảm bảo backend vẫn có thể trả về lỗi nếu cần
      }
    } catch (error) {
      // Hiển thị thông báo lỗi khi có sự cố trong việc gọi API
      setMessage("Đã xảy ra lỗi khi gọi API.");
      setErrors([]);
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Thêm Sản Phẩm</h1>

      {message && <div className="alert alert-info">{message}</div>}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giá gốc</label>
          <input
            type="number"
            name="regularPrice"
            value={formData.regularPrice}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giá giảm</label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Thương hiệu</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Kích thước</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Màu sắc</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Chất liệu</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giới tính</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Đóng gói</label>
          <input
            type="text"
            name="packaging"
            value={formData.packaging}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Xuất xứ</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nhà sản xuất</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        {formData.imageData && (
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <img
                src={formData.imageData}
                alt={formData.name || "Ảnh sản phẩm"}
                className="img-thumbnail me-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <span className="text-muted">Hình ảnh xem trước</span>
            </div>
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label">SEO Title</label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">SEO Alias</label>
          <input
            type="text"
            name="seoAlias"
            value={formData.seoAlias}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">
            Danh mục (ID cách nhau bằng dấu phẩy)
          </label>
          <input
            type="text"
            value={
              formData.categoryIds.length > 0
                ? formData.categoryIds.join(",")
                : ""
            }
            onChange={handleCategoryIdsChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Kích hoạt</label>
          <div className="form-check">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label">Có</label>
          </div>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary">
            Thêm Sản Phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
