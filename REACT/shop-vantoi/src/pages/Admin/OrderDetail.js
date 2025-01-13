// src/components/OrderDetail.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-order-by-customer-id?id=${id}`
      );
      if (!response.ok) throw new Error("Không thể lấy thông tin đơn hàng.");
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Chi tiết đơn hàng</h1>
      {order && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Thông tin đơn hàng</h5>
            <p>
              <strong>ID:</strong> {order.id}
            </p>
            <p>
              <strong>Khách hàng:</strong> {order.customerName}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {order.totalAmount} VND
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            {/* Thêm thông tin chi tiết khác nếu cần */}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
