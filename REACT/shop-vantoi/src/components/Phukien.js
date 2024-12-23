import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      <h2>Phụ kiện thời trang{categoryId}</h2>
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
