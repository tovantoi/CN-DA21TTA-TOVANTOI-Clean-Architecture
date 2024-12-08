import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    productName: "",
    regularPrice: "",
    discountPrice: "",
    description: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    gender: "",
    packaging: "",
    origin: "",
    manufacturer: "",
    imagePath: "",
    seoTitle: "",
    seoAlias: "",
    isActive: true,
    categoryIds: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details when the page loads
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-detail?id=${productId}`
        );
        const data = await response.json();
        if (data) {
          setProduct(data);
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://localhost:7022/minimal/api/update-product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const result = await response.json();
      if (response.ok && result.isSuccess) {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/admin/products");
      } else {
        setError(result.message || "Lỗi khi cập nhật sản phẩm.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: checked,
    }));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Tên sản phẩm
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="regularPrice" className="form-label">
            Giá thường
          </label>
          <input
            type="number"
            className="form-control"
            id="regularPrice"
            name="regularPrice"
            value={product.regularPrice}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="discountPrice" className="form-label">
            Giá khuyến mãi
          </label>
          <input
            type="number"
            className="form-control"
            id="discountPrice"
            name="discountPrice"
            value={product.discountPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Mô tả
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="categoryIds" className="form-label">
            Chọn danh mục
          </label>
          <select
            multiple
            className="form-control"
            id="categoryIds"
            name="categoryIds"
            value={product.categoryIds}
            onChange={handleChange}
          >
            {/* Categories should be fetched and listed here */}
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
            <option value="3">Category 3</option>
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={product.isActive}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isActive">
            Sản phẩm đang bán
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default ProductEditPage;
