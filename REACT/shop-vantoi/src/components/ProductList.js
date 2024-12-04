import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-products"
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Không thể lấy danh sách sản phẩm.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list container">
      <h2 className="text-center my-4">Danh Sách Sản Phẩm</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {products.map((product) => (
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
                  Giá: {product.discountPrice || product.regularPrice} VND
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
