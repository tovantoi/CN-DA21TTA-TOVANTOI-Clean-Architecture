import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CategorySearch = () => {
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1); 
  const [pageSize, setPageSize] = useState(6); 
  const navigate = useNavigate();

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

  const handleCategoryClick = async (categoryId) => {
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
        setFilteredProducts([]);
        return;
      }

      const data = await response.json();
      setFilteredProducts(data.data || []); 
      setError(""); 
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
    }
  };

  return (
    <div className="container">
      <h2>Danh mục</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="category-list d-flex justify-content-around">
        {categories.map((category) => (
          <div
            className="category-item text-center"
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                category.imagePath && category.imagePath !== "string"
                  ? `https://localhost:7241/${category.imagePath}`
                  : "https://via.placeholder.com/400"
              }
              alt={category.productName}
              style={{ width: "100%", height: "250px", objectFit: "cover" }}
            />
            <h4>{category.name}</h4>
          </div>
        ))}
      </div>

      <hr />

      <h2>Sản phẩm</h2>
      <div className="product-list d-flex flex-wrap">
        {filteredProducts.length > 0
          ? filteredProducts.map((product) => (
              <div
                className="product-item card m-2"
                key={product.id}
                style={{ width: "200px", cursor: "pointer" }}
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
          : !error && <p>Chọn danh mục để xem sản phẩm.</p>}
      </div>
    </div>
  );
};

export default CategorySearch;
