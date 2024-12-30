import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const CategoryProductsPage = () => {
  const { id } = useParams(); // Lấy ID danh mục từ URL
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8); // Giữ pageSize cố định
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Bắt đầu tải
      setError(""); // Xóa lỗi cũ
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products-by-category?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );

        if (!response.ok) throw new Error("Không thể tải sản phẩm.");

        const data = await response.json();

        // Giả sử API trả về { data: [], totalPages: n }
        setProducts(data.data || []); // Đảm bảo `data` luôn là mảng
        setTotalPages(data.totalPages || 0); // Cập nhật số trang tổng
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    fetchProducts();
  }, [id, pageNumber, pageSize]);

  // Hàm thay đổi trang
  const handlePageChange = (direction) => {
    setPageNumber((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 && newPage <= totalPages ? newPage : prevPage;
    });
  };

  return (
    <div className="container my-4">
      <h1 className="text-center">Sản phẩm trong danh mục</h1>

      {/* Hiển thị lỗi */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Hiển thị sản phẩm */}
      <div className="product-list d-flex flex-wrap">
        {!loading && products.length > 0 ? (
          products.map((product) => (
            <div
              className="product-item card m-2"
              key={product.id}
              style={{ width: "200px" }}
            >
              <img
                src={
                  product.imagePath
                    ? `https://localhost:7241/${product.imagePath}`
                    : "https://via.placeholder.com/400"
                }
                alt={product.name}
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5>{product.name}</h5>
                <p>{product.price} VND</p>
              </div>
            </div>
          ))
        ) : !loading ? (
          <p className="text-center">Không có sản phẩm nào.</p>
        ) : null}
      </div>

      {/* Phân trang */}
      <div className="pagination-controls text-center mt-4">
        <button
          className="btn btn-primary mx-2"
          onClick={() => handlePageChange("prev")}
          disabled={pageNumber <= 1}
        >
          Trang trước
        </button>
        <span>Trang {pageNumber} / {totalPages}</span>
        <button
          className="btn btn-primary mx-2"
          onClick={() => handlePageChange("next")}
          disabled={pageNumber >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
