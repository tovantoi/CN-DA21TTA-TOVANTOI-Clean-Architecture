import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null); // Dữ liệu từ API
  const [cachedOrder, setCachedOrder] = useState(null); // Dữ liệu từ localStorage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError("");

      try {
        // Lấy dữ liệu từ localStorage
        const cachedOrderData = JSON.parse(
          localStorage.getItem("selectedOrder")
        );
        if (cachedOrderData && cachedOrderData.id === parseInt(orderId, 10)) {
          setCachedOrder(cachedOrderData);
        }

        // Gọi API để lấy các thông tin khác
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-order-by-id?id=${orderId}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải chi tiết đơn hàng.");
        }

        const apiData = await response.json();
        setOrder(apiData);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <strong>{error}</strong>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="alert alert-warning text-center">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="container my-4">
      <button
        className="btn btn-primary btn-lg mb-3"
        onClick={() => navigate("/my-orders")}
      >
        Quay lại danh sách đơn hàng
      </button>
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h2 className="card-title">Chi tiết đơn hàng</h2>
          <hr />
          {/* <p>
            <strong>Họ và tên:</strong> {order.address?.fullName || "N/A"}
          </p> */}
          <p>
            <strong>Số điện thoại:</strong> {order.address?.phone || "N/A"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.address?.finalAddress || "N/A"}
          </p>
          <p>
            <strong>Trạng thái đơn hàng:</strong>{" "}
            {order.status || "Đang giao hàng"}
          </p>
          <p>
            <strong>Shiper:</strong> {"Nguyễn Xuân Son"}
            <strong>-</strong>
            <strong>SĐT:</strong> {"0123456789"}
          </p>
          <h4 className="mt-4">Người nhận:</h4>
          <p>{cachedOrder?.name || "Không có thông tin đơn hàng"}</p>
          <h4 className="mt-4">Sản phẩm:</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Tổng giá</th>
                </tr>
              </thead>
              <tbody>
                {(cachedOrder?.products || []).map((product, index) => {
                  const orderItem = order.orderItems[index]; // Tìm sản phẩm tương ứng trong order.orderItems
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={
                            product.imagePath && product.imagePath !== "string"
                              ? `https://localhost:7241/${product.imagePath}`
                              : "https://via.placeholder.com/400"
                          }
                          alt={product.productName || "Sản phẩm"}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{product.productName || "Tên sản phẩm không có"}</td>
                      <td>{orderItem?.quantity || 0}</td>
                      <td>{order.totalPrice?.toLocaleString() || "N/A"} VND</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
