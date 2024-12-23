import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

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

  const handleDelete = async (categoryId, categoryName) => {
    try {
      // Hiển thị thông báo xác nhận
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa danh mục?",
        text: `Danh mục: ${categoryName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        // Nếu người dùng xác nhận xóa, thực hiện xóa danh mục
        const response = await fetch(
          `https://localhost:7022/minimal/api/delete-category?id=${categoryId}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Không thể xóa danh mục.");

        // Xóa danh mục khỏi danh sách
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );

        // Hiển thị thông báo xóa thành công
        Swal.fire({
          title: "Thành công!",
          text: "Danh mục đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi xóa danh mục.");
    }
  };
  return (
    <div className="container my-4">
      <motion.h1
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity, // Lặp lại vô hạn
          repeatType: "reverse", // Lặp lại theo chiều ngược lại
          repeatDelay: 2, // Đợi 4 giây (tổng thời gian sẽ là 5 giây vì thời gian animation là 1 giây)
        }}
        style={{
          background: "linear-gradient(45deg, #ff6ec7, #ffy900)",
          color: "red",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Quản lý danh mục
      </motion.h1>
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
