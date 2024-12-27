import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProductsByCategory = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();
  const categoryId = 4; // ID của danh mục

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products-by-category?id=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Không tìm thấy sản phẩm nào thuộc danh mục này.");
          } else {
            throw new Error("Đã xảy ra lỗi khi tải sản phẩm.");
          }
          setProducts([]);
          return;
        }

        const data = await response.json();
        setProducts(data.data || []); // Lưu sản phẩm vào state
        setError(""); // Xóa lỗi nếu có
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className="container">
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
          color: "Blue",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Danh sách phụ kiện
      </motion.h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="product-list d-flex flex-wrap">
        {products.length > 0
          ? products.map((product) => (
              <div
                className="product-item card m-2"
                key={product.id}
                style={{ width: "200px" }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={
                    product.imagePath && product.imagePath !== "string"
                      ? `https://localhost:7241/${product.imagePath}`
                      : "https://via.placeholder.com/400"
                  }
                  alt={product.productName}
                  style={{ width: "100%", height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>{product.productName}</h5>
                  <p>{product.discountPrice || product.regularPrice} VND</p>
                </div>
              </div>
            ))
          : !error && <p>Không có sản phẩm nào trong danh mục này.</p>}
      </div>
    </div>
  );
};

export default ProductsByCategory;
