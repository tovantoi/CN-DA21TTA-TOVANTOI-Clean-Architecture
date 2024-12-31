import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "../pages/AdminCss/Categorylist.css";

const CategorySearch = () => {
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
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
          "https://localhost:7022/minimal/api/get-categories"
        );
        if (!response.ok) throw new Error("Không thể tải danh mục.");
        const data = await response.json();
        setCategories(data);
        swalInstance.close();
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải danh mục.");
        swalInstance.close();
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
      Swal.fire({
        title: "Đã có lỗi xảy ra khi tải sản phẩm",
        text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container">
      {/* <h2>Danh mục</h2> */}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="category-list d-flex justify-content-around">
        {categories.map((category) => (
          <motion.div
            className="category-item text-center"
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{ cursor: "pointer" }}
            whileHover={{
              scale: 1.1, // Phóng to nhẹ
              backgroundColor: "#455a64", // Đổi màu nền khi hover
              color: "orange",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Thêm bóng
            }}
            transition={{
              duration: 0.3, // Thời gian thực hiện hiệu ứng
              ease: "easeInOut", // Làm mượt chuyển động
            }}
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
          </motion.div>
        ))}
      </div>

      <hr />

      <div className="product-list">
        <h2 className="text-center mb-4">Sản phẩm</h2>
        <div className="grid-container">
          {filteredProducts.length > 0
            ? filteredProducts.map((product) => (
                <motion.div
                  className="product-item"
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: "pointer" }}
                  whileHover={{
                    backgroundColor: "#455a64", // Đổi màu nền khi hover
                    color: "orange",
                    scale: 1.1,
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    className="img-ca"
                    src={
                      product.imagePath && product.imagePath !== "string"
                        ? `https://localhost:7241/${product.imagePath}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={product.productName}
                  />
                  <div className="product-details text-center">
                    <h5>{product.productName}</h5>
                    <p>{product.discountPrice || product.regularPrice} VND</p>
                  </div>
                </motion.div>
              ))
            : !error && <p>Chọn danh mục để xem sản phẩm.</p>}
        </div>
      </div>
    </div>
  );
};

export default CategorySearch;
