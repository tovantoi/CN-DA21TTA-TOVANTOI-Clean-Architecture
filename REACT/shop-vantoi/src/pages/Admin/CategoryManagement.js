import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

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

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/delete-category?id=${categoryId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Không thể xóa danh mục.");
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi xóa danh mục.");
    }
  };

  return (
    <div className="container">
      <h2>Quản lý Danh mục</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link to="/admin/add-category" className="btn btn-primary mb-3">
        Thêm Danh mục
      </Link>
      <div className="category-list d-flex flex-wrap">
        {categories.map((category) => (
          <div
            className="category-item card m-2"
            key={category.id}
            style={{ width: "200px" }}
          >
            <img
              src={
                category.imagePath && category.imagePath !== "string"
                  ? `https://localhost:7241/${category.imagePath}`
                  : "https://via.placeholder.com/400"
              }
              alt={category.name}
              style={{ width: "100%", height: "250px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5>{category.name}</h5>
              <Link
                to={`/admin/edit-category/${category.id}`}
                className="btn btn-warning m-1"
              >
                Chỉnh sửa
              </Link>
              <button
                onClick={() => handleDelete(category.id)}
                className="btn btn-danger m-1"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
