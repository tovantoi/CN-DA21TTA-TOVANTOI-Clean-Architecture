import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [pageNumber, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(8); // Số sản phẩm mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Không thể lấy danh sách sản phẩm.");
        }

        const data = await response.json();
        console.log("Fetched products data:", data); // Log dữ liệu để kiểm tra
        setProducts(data.data || []); // Gán danh sách sản phẩm từ API
        setTotalPages(data.totalPages || 1); // Gán số trang từ API
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    };

    fetchProducts();
  }, [pageNumber, pageSize]); // Fetch lại khi thay đổi trang

  const handlePageChange = (newPageNumber) => {
    if (newPageNumber > 0 && newPageNumber <= totalPages) {
      setCurrentPage(newPageNumber); // Thay đổi trang khi người dùng click
    }
  };

  return (
    <div className="product-list container">
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
        Danh sách sản phẩm
      </motion.h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="col"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm product-card">
                <div className="card-img-container">
                  <img
                    src={
                      product.imagePath && product.imagePath !== "string"
                        ? `https://localhost:7241/${product.imagePath}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.productName}
                    className="card-img-top img-fluid"
                  />
                  <div className="card-hover-overlay">
                    <span className="text-white">Xem chi tiết</span>
                  </div>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text text-muted">
                    {product.description || "Sản phẩm không có mô tả."}
                  </p>
                  <p className="card-text text-primary fw-bold">
                    {product.discountPrice?.toLocaleString() || "N/A"} VND{" "}
                    <span className="text-decoration-line-through text-muted fs-5">
                      {product.regularPrice?.toLocaleString() || "N/A"} VND
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning">Không có sản phẩm nào.</div>
        )}
      </div>

      <center>
        <div className="pagination mt-4 d-flex justify-content-center">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            Prev
          </button>
          <span className="mx-3">
            Trang {pageNumber} / {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
          >
            Next
          </button>
        </div>
      </center>
    </div>
  );
};

export default ProductList;
