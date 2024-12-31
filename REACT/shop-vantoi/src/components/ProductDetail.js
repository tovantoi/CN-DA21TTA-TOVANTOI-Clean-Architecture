import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      // Hiển thị thông báo loading
      const swalInstance = Swal.fire({
        title: "Đang tải sản phẩm...",
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
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-detail?id=${productId}`
        );
        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm.");
        }

        const data = await response.json();
        setProduct(data);

        // Đóng thông báo khi tải xong
        swalInstance.close();
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        // Đóng thông báo khi có lỗi
        swalInstance.close();
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return null; // Không cần hiển thị gì thêm khi đang tải
  }

  return (
    <div className="container mt-4">
      <motion.button
        onClick={() => navigate(-1)} // Trở về danh sách bài viết
        className="btn btn-primary mb-4"
        initial={{ opacity: 0, scale: 0.9 }} // Nút bắt đầu mờ và nhỏ
        animate={{ opacity: 1, scale: 1 }} // Nút hiện rõ và kích thước bình thường
        whileHover={{
          scale: 1.1, // Phóng to khi hover
          backgroundColor: "#0056b3", // Đổi màu nền khi hover
          boxShadow: "0px 0px 10px rgba(0, 0, 255, 0.5)", // Thêm ánh sáng khi hover
        }}
        whileTap={{
          scale: 0.95, // Thu nhỏ nhẹ khi click
        }}
        transition={{
          duration: 0.3, // Thời gian thực hiện hiệu ứng
          ease: "easeInOut", // Làm mượt hiệu ứng
        }}
      >
        ← Quay lại
      </motion.button>

      <div className="row">
        {/* Hình ảnh sản phẩm */}
        <div className="col-md-6">
          <div className="product-images">
            <img
              src={
                product.imagePath && product.imagePath !== "string"
                  ? `https://localhost:7241/${product.imagePath}`
                  : "https://via.placeholder.com/400"
              }
              alt={product.productName}
              className="img-fluid main-image"
            />
            {/* Hiển thị ảnh nhỏ nếu có */}
            <div className="image-thumbnails mt-2 d-flex gap-2">
              <img
                src={
                  product.imagePath && product.imagePath !== "string"
                    ? `https://localhost:7241/${product.imagePath}`
                    : "https://via.placeholder.com/100"
                }
                alt="Thumbnail"
                className="img-thumbnail"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2>{product.productName}</h2>
          <p className="text-muted">Thương hiệu: {product.brand || "N/A"}</p>
          <p className="text-danger fs-4">
            Giá: {product.discountPrice || product.regularPrice} VND
          </p>
          <ul>
            <li>{product.description}</li>
            <li>Kích thước: {product.size || "N/A"}</li>
            <li>Chất liệu: {product.material || "N/A"}</li>
            <li>Màu sắc: {product.color || "N/A"}</li>
          </ul>
          {/* Số lượng */}
          <div className="d-flex align-items-center my-3">
            <label className="me-2">Số lượng:</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="form-control w-25"
            />
          </div>
          {/* Nút thêm vào giỏ hàng */}
          <button
            className="btn btn-success w-100"
            onClick={() => {
              addToCart({ ...product, quantity });
              Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: "Sản phẩm đã được thêm vào giỏ hàng.",
                confirmButtonText: "Đóng",
              });
            }}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Mô tả chi tiết sản phẩm */}
      <div className="mt-4">
        <h3>Mô tả sản phẩm</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
