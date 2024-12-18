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
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="text-center">
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
                        : "https://via.placeholder.com/100"
                    }
                    alt="Thumbnail"
                    className="img-thumbnail"
                    style={{ width: "60px", height: "60px" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
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
