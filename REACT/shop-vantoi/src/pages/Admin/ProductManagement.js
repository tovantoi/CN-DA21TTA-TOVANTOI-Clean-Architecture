import React, { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:7022/admin/api/products");
      if (!response.ok) throw new Error("Không thể lấy danh sách sản phẩm.");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const response = await fetch(
        `https://localhost:7022/admin/api/products/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Không thể xóa sản phẩm.");
      setProducts(products.filter((product) => product.id !== id));
      setSuccessMessage("Xóa sản phẩm thành công!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Quản lý sản phẩm</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <button
        className="btn btn-success mb-3"
        onClick={() => (window.location.href = "/admin/products/new")}
      >
        Thêm sản phẩm
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.productName}</td>
                <td>{product.discountPrice || product.regularPrice} VND</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      (window.location.href = `/admin/products/${product.id}`)
                    }
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Không có sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
