import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({ name: "", imagePath: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-category-by-id?id=${id}`
        );
        if (!response.ok) throw new Error("Không thể tải danh mục.");
        const data = await response.json();
        setCategory(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải danh mục.");
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/edit-category?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        }
      );
      if (!response.ok) throw new Error("Không thể chỉnh sửa danh mục.");
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi chỉnh sửa danh mục.");
    }
  };

  return (
    <div className="container">
      <h2>Chỉnh sửa Danh mục</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagePath">Đường dẫn hình ảnh</label>
          <input
            type="text"
            className="form-control"
            id="imagePath"
            value={category.imagePath}
            onChange={(e) =>
              setCategory({ ...category, imagePath: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
