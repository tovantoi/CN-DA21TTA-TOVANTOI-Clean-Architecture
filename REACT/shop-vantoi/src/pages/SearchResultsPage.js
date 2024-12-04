import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook để điều hướng
  const { results = [], query } = location.state || {};

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Điều hướng tới trang chi tiết sản phẩm
  };

  return (
    <div className="search-results container py-4">
      <h2 className="text-center mb-4">Kết quả tìm kiếm cho: "{query}"</h2>
      {results.length === 0 ? (
        <p className="text-center">Không tìm thấy sản phẩm nào phù hợp.</p>
      ) : (
        <div className="row">
          {results.map((product) => (
            <div
              className="col-md-3 mb-4"
              key={product.id}
              onClick={() => handleProductClick(product.id)} // Thêm sự kiện click
              style={{ cursor: "pointer" }} // Thêm style để hiển thị con trỏ tay
            >
              <div className="card h-100">
                <img
                  src={
                    product.imagePath
                      ? `https://localhost:7241/${product.imagePath}`
                      : "https://via.placeholder.com/300"
                  }
                  className="card-img-top"
                  alt={product.productName}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text text-primary">
                    Giá: {product.discountPrice || product.regularPrice} VND
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
