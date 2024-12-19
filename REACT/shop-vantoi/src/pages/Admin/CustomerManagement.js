import React, { useState, useEffect } from "react";

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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá khách hàng này?")) {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/delete-customer?id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setCustomers(customers.filter((customer) => customer.id !== id));
          alert("Khách hàng đã được xoá.");
        } else {
          alert("Không thể xoá khách hàng.");
        }
      } catch (err) {
        alert("Đã xảy ra lỗi khi xoá khách hàng.");
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Quản lý khách hàng</h2>
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
                      customer.avatarImagePath && customer.avatarImagePath !== "string"
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
