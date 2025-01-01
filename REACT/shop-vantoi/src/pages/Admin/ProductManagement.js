import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-products-admin"
      );
      if (!response.ok) throw new Error("Không thể lấy danh sách sản phẩm.");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa sản phẩm?",
        text: `Sản phẩm: ${productName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      const response = await fetch(
        `https://localhost:7022/minimal/api/delete-product?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể xóa sản phẩm.");
      }

      setProducts(products.filter((product) => product.id !== id));

      await Swal.fire({
        title: "Thành công!",
        text: "Sản phẩm đã được xóa.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      await Swal.fire({
        title: "Lỗi!",
        text: `Lỗi: ${err.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <motion.div
      className="container my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
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
        Quản lý sản phẩm
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
      {successMessage && (
        <motion.div
          className="alert alert-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {successMessage}
        </motion.div>
      )}

      <motion.button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/add-product")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        Thêm sản phẩm
      </motion.button>

      <motion.table
        className="table table-striped"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <motion.tbody
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product) => (
              <motion.tr
                key={product.productId}
                whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa" }}
                transition={{ duration: 0.3 }}
              >
                <td>
                  <motion.img
                    src={
                      product.imagePath && product.imagePath !== "string"
                        ? `https://localhost:7241/${product.imagePath}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={product.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </td>
                <td>{product.productName}</td>
                <td>{product.discountPrice || product.regularPrice} VND</td>
                <td>
                  {product.isActive == 1 ? (
                    <span className="badge bg-success">Còn hàng</span>
                  ) : (
                    <span className="badge bg-danger">Hết hàng</span>
                  )}
                </td>
                <td>
                  <motion.button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      navigate(`/admin/editproducts/${product.id}`)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sửa
                  </motion.button>
                  <motion.button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(product.id, product.productName)
                    }
                    whileHover={{ scale: 1.1, backgroundColor: "#e53935" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Xóa
                  </motion.button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Không có sản phẩm
              </td>
            </tr>
          )}
        </motion.tbody>
      </motion.table>
    </motion.div>
  );
};

export default ProductManagement;
