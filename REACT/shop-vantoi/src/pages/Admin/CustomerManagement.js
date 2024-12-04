import React, { useState, useEffect } from 'react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7022/admin/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError('Không thể lấy danh sách khách hàng');
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
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="3" className="text-center">Đang tải...</td></tr>
          ) : customers.length > 0 ? (
            customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3" className="text-center">Không có khách hàng</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
