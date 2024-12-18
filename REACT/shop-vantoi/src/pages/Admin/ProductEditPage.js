import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductEditPage = () => {
  const { productId } = useParams(); // Lấy productId từ URL
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-detail?id=${productId}`
        );
        if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm.");
        const data = await response.json();
        setProduct(data); // Cập nhật state sản phẩm
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/update-product?id=${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Cập nhật sản phẩm thất bại.");
      }

      alert("Cập nhật sản phẩm thành công!");
      
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProduct((prevProduct) => ({
          ...prevProduct,
          imageData: event.target.result, // Chuyển hình ảnh sang Base64
        }));
      };
      reader.readAsDataURL(file); // Đọc file
    }
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
          <label htmlFor="imageData" className="form-label">
            Hình ảnh sản phẩm
          </label>
          <input
            type="file"
            id="imageData"
            name="imageData"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        {product.imageData && (
          <div className="mb-3">
            <label className="form-label">Xem trước hình ảnh</label>
            <div className="preview-container">
              <img
                src={product.imageData}
                alt="Xem trước sản phẩm"
                className="img-thumbnail"
                style={{ maxWidth: "300px", height: "auto" }}
              />
            </div>
          </div>
        )}
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

        {/* Các trường mới được thêm */}
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">
            Thương hiệu
          </label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="size" className="form-label">
            Kích thước
          </label>
          <input
            type="text"
            className="form-control"
            id="size"
            name="size"
            value={product.size}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="color" className="form-label">
            Màu sắc
          </label>
          <input
            type="text"
            className="form-control"
            id="color"
            name="color"
            value={product.color}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="material" className="form-label">
            Chất liệu
          </label>
          <input
            type="text"
            className="form-control"
            id="material"
            name="material"
            value={product.material}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Giới tính
          </label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={product.gender}
            onChange={handleChange}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="packaging" className="form-label">
            Bao bì
          </label>
          <input
            type="text"
            className="form-control"
            id="packaging"
            name="packaging"
            value={product.packaging}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="origin" className="form-label">
            Xuất xứ
          </label>
          <input
            type="text"
            className="form-control"
            id="origin"
            name="origin"
            value={product.origin}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="manufacturer" className="form-label">
            Nhà sản xuất
          </label>
          <input
            type="text"
            className="form-control"
            id="manufacturer"
            name="manufacturer"
            value={product.manufacturer}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="seoTitle" className="form-label">
            Tiêu đề SEO
          </label>
          <input
            type="text"
            className="form-control"
            id="seoTitle"
            name="seoTitle"
            value={product.seoTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="seoAlias" className="form-label">
            SEO Alias
          </label>
          <input
            type="text"
            className="form-control"
            id="seoAlias"
            name="seoAlias"
            value={product.seoAlias}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="isActive" className="form-label">
            Trạng thái sản phẩm
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={product.isActive}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isActive">
            Còn hàng
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
