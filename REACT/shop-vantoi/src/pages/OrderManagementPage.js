import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng
        if (!user || !user.id) {
          throw new Error("Bạn cần đăng nhập để xem đơn hàng.");
        }

        const customerId = user.id; // Lấy customerId từ localStorage
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-order-by-customer-id?id=${customerId}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách đơn hàng.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <div className="alert alert-warning text-center">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div
              className="col-md-4"
              key={order.id}
              onClick={(e) => {
                if (!e.target.closest(".no-click")) {
                  navigate(`/order/${order.id}`);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm border-0">
                <div className="card-img-top position-relative">
                  <img
                    src={
                      order.orderItems[0]?.imagePath &&
                      order.orderItems[0]?.imagePath !== "string"
                        ? `https://localhost:7241/${order.orderItems[0]?.imagePath}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={order.orderItems[0]?.productName}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title text-truncate">
                    {order.orderItems[0]?.productName || "Sản phẩm"}
                  </h5>
                  <p className="card-text text-muted">
                    Giá:{" "}
                    <strong>
                      {order.totalPrice?.toLocaleString() || "N/A"} VND
                    </strong>
                  </p>
                  <p className="card-text">
                    Số lượng:{" "}
                    <strong>{order.orderItems[0]?.quantity || 0}</strong>
                  </p>
                </div>
                <div className="card-footer bg-light text-center"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
