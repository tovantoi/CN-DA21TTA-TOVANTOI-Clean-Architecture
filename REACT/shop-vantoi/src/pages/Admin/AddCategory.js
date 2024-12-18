import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/add-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, imagePath }),
        }
      );
      if (!response.ok) throw new Error("Không thể thêm danh mục.");
      navigate("/admin");
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
          <label htmlFor="name">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagePath">Đường dẫn hình ảnh</label>
          <input
            type="text"
            className="form-control"
            id="imagePath"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Thêm
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
