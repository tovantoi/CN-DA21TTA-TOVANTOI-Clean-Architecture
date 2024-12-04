import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams(); // Lấy `productId` từ URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-detail?id=${productId}`
        );
        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mt-4">
      <button onClick={() => navigate(-1)} className="btn btn-light mb-3">
        Quay lại
      </button>
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
                style={{ width: "60px", height: "60px" }}
              />
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2>{product.productName}</h2>
          <p className="text-muted">Thương hiệu: {product.brand || "N/A"}</p>
          <p className="text-danger fs-4">
            {product.discountPrice?.toLocaleString() || "N/A"} VND{" "}
            <span className="text-decoration-line-through text-muted fs-5">
              {product.regularPrice?.toLocaleString() || "N/A"} VND
            </span>
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
              alert("Đã thêm vào giỏ hàng!");
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
