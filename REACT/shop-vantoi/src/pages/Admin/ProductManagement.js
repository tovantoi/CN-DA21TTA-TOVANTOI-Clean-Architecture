import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch danh sách sản phẩm
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

  // Xóa sản phẩm
  const handleDelete = async (id, productName) => {
    try {
      // Hiển thị thông báo xác nhận
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa sản phẩm?",
        text: `Sản phẩm: ${productName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      // Thực hiện xóa sản phẩm
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

      const resultData = await response.json();
      if (resultData.isSuccess) {
        // Cập nhật danh sách sản phẩm
        setProducts(products.filter((product) => product.id !== id));

        // Hiển thị thông báo thành công
        await Swal.fire({
          title: "Thành công!",
          text: "Sản phẩm đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        throw new Error(resultData.message || "Không thể xóa sản phẩm.");
      }
    } catch (err) {
      // Hiển thị thông báo lỗi
      await Swal.fire({
        title: "Lỗi!",
        text: `Lỗi: ${err.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
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
        Quản lý sản phẩm
      </motion.h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/add-product")} // Sử dụng navigate
      >
        Thêm sản phẩm
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product) => (
              <tr key={product.productId}>
                <td>
                  <img
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
                  <button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      navigate(`/admin/editproducts/${product.id}`)
                    }
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(product.id)} // Đảm bảo dùng productId
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Không có sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
