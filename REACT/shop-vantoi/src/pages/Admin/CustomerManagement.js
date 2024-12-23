import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-customers"
      );
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError("Không thể lấy danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, customerName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa khách hàng?",
        text: `Khách hàng: ${customerName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://localhost:7022/minimal/api/delete-customer?id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Không thể xóa khách hàng.");

        setCustomers(customers.filter((customer) => customer.id !== id));

        await Swal.fire({
          title: "Thành công!",
          text: "Khách hàng đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      await Swal.fire({
        title: "Lỗi!",
        text: err.message || "Đã xảy ra lỗi khi xóa khách hàng.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container my-4">
      <motion.h1
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity, // Lặp lại vô hạn
          repeatType: "reverse", // Lặp lại theo chiều ngược lại
          repeatDelay: 2, // Đợi 4 giây (tổng thời gian sẽ là 5 giây vì thời gian animation là 1 giây)
        }}
        style={{
          background: "linear-gradient(45deg, #ff6ec7, #ffy900)",
          color: "red",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Quản lý khách hàng
      </motion.h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Họ</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Avatar</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>
                  <img
                    src={
                      customer.avatarImagePath &&
                      customer.avatarImagePath !== "string"
                        ? `https://localhost:7241/${customer.avatarImagePath}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={customer.firstName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có khách hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
