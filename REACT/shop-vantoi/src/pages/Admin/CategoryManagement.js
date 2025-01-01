import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa danh mục?",
        text: `Danh mục: ${categoryName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://localhost:7022/minimal/api/delete-category?id=${categoryId}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Không thể xóa danh mục.");

        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );

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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        whileHover={{
          scale: 1.1,
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.9)",
          color: "#ff5722",
        }}
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#333",
          textTransform: "uppercase",
        }}
      >
        Quản lý danh mục
      </motion.h1>
      {error && (
        <motion.div
          className="alert alert-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}
      <Link
        to="/admin/add-category"
        className="btn btn-primary mb-3"
        as={motion.a}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        Thêm Danh mục
      </Link>
      <motion.div
        className="category-list d-flex flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {categories.map((category) => (
          <motion.div
            className="category-item card m-2"
            key={category.id}
            style={{ width: "200px" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/admin/category-products/${category.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.img
                src={
                  category.imagePath && category.imagePath !== "string"
                    ? `https://localhost:7241/${category.imagePath}`
                    : "https://via.placeholder.com/400"
                }
                alt={category.name}
                style={{
                  width: "200px",
                  height: "250px",
                  objectFit: "cover",
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="card-body"
                whileHover={{ color: "#ff5722" }}
              >
                <h5>{category.name}</h5>
              </motion.div>
            </Link>
            <div className="card-body d-flex justify-content-around">
              <Link
                to={`/admin/edit-category/${category.id}`}
                className="btn btn-warning m-1"
                as={motion.a}
                whileHover={{ scale: 1.1, backgroundColor: "#ffc107" }}
                whileTap={{ scale: 0.95 }}
              >
                Chỉnh sửa
              </Link>
              <motion.button
                onClick={() => handleDelete(category.id, category.name)}
                className="btn btn-danger m-1"
                whileHover={{ scale: 1.1, backgroundColor: "#e53935" }}
                whileTap={{ scale: 0.95 }}
              >
                Xóa
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryManagement;
