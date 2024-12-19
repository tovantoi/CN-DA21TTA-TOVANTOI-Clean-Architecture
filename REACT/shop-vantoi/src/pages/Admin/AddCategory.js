import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    parentId: null,
    name: "",
    description: "",
    isActive: true,
    imageData: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-categories"
        );
        if (!response.ok) throw new Error("Không thể tải danh mục.");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải danh mục.");
      }
    };

    fetchCategories();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/create-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (!response.ok || !result.isSuccess) {
        throw new Error(result.message || "Không thể thêm danh mục.");
      }

      setSuccessMessage(result.message || "Thêm danh mục thành công!");
      setTimeout(() => {
        navigate("/admin/category");
      }, 1000);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi thêm danh mục.");
    }
  };

  return (
    <div className="container">
      <h2>Thêm Danh mục</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="parentId">Danh mục cha</label>
          <select
            className="form-control"
            id="parentId"
            name="parentId"
            value={formData.parentId || ""}
            onChange={handleInputChange}
          >
            <option value="">Không có</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageData">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            id="imageData"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div><br></br>
        <div className="form-group">
          <label htmlFor="isActive">Kích hoạt</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
        </div>
        <br></br>
        <button type="submit" className="btn btn-primary">
          Thêm
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
