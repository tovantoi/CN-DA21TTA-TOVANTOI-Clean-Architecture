import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-order-by-id?id=${orderId}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải chi tiết đơn hàng.");
        }

        const data = await response.json();
        setOrder(data);
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
            <strong>ID:</strong> {order.id}
          </p> */}
          <p>
            <strong>Họ và tên:</strong> {order.address.fullName || "N/A"}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.address.phone || "N/A"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.address.finalAddress || "N/A"}
          </p>
          <p>
            <strong>Trạng thái:</strong> {order.status || "N/A"}
          </p>
          <p>
            <strong>Mã giảm giá đã áp dụng:</strong> {order.coupon || "N/A"}
          </p>
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
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          order.orderItems[0]?.imagePath &&
                          order.orderItems[0]?.imagePath !== "string"
                            ? `https://localhost:7241/${order.orderItems[0]?.imagePath}`
                            : "https://via.placeholder.com/400"
                        }
                        alt={order.orderItems[0]?.productName}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{order.totalPrice?.toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {order.coupon && (
            <p className="mt-3">
              <strong>Mã giảm giá:</strong> {order.coupon.description || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
