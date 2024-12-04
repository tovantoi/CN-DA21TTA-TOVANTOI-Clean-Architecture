import React, { useState } from "react";

const CheckoutPage = ({ cart, setCart }) => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    shippingMethod: "GHN - Tiêu chuẩn",
    paymentMethod: "CASH",
    discountCode: "",
    includeInvoice: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const totalProductPrice = cart.reduce(
    (total, item) =>
      total + (item.discountPrice || item.regularPrice) * item.quantity,
    0
  );

  const shippingFee = 30000; // Phí vận chuyển cố định
  const totalPrice = totalProductPrice + shippingFee;

  const handleApplyDiscount = () => {
    alert("Áp dụng mã giảm giá thành công!");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Gọi API tạo địa chỉ khách hàng
      const addressResponse = await fetch(
        "https://localhost:7022/minimal/api/create-customeraddress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: 13, // Thay đổi theo cơ chế đăng nhập
            fullName: formData.fullName,
            phone: formData.phone,
            province: formData.city,
            district: formData.district,
            ward: formData.ward,
            address: formData.address,
          }),
        }
      );

      const addressData = await addressResponse.json();

      if (!addressResponse.ok || !addressData.isSuccess) {
        throw new Error(
          addressData.message || "Không thể tạo địa chỉ giao hàng."
        );
      }

      const customerAddressId = addressData.data.id; // ID địa chỉ giao hàng từ API

      // Gọi API tạo đơn hàng
      const orderResponse = await fetch("https://localhost:7022/minimal/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: 13, // Thay đổi theo cơ chế đăng nhập
          customerAddressId,
          couponCode: formData.discountCode || null,
          paymentMethod: formData.paymentMethod,
          totalPrice,
          orderItems: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity || 1,
          })),
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.isSuccess) {
        throw new Error(orderData.message || "Không thể tạo đơn hàng.");
      }

      // Xử lý khi đặt hàng thành công
      setSuccessMessage("Đơn hàng của bạn đã được đặt thành công!");
      setCart([]); // Xóa giỏ hàng
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Thanh toán</h2>
      {successMessage && (
        <div className="alert alert-success text-center">{successMessage}</div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row">
        {/* Thông tin giao hàng */}
        <div className="col-md-7">
          <h4>1. Địa chỉ giao hàng</h4>
          <form>
            <div className="mb-3">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Họ và Tên *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Tỉnh/Thành phố *</label>
              <select
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Quận/Huyện *</label>
              <input
                type="text"
                name="district"
                className="form-control"
                value={formData.district}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Phường/Xã *</label>
              <input
                type="text"
                name="ward"
                className="form-control"
                value={formData.ward}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Địa chỉ chi tiết *</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Ghi chú</label>
              <textarea
                name="note"
                className="form-control"
                rows="3"
                placeholder="Ghi chú cho đơn hàng (nếu có)"
              ></textarea>
            </div>
          </form>
          <h4>2. Vận chuyển</h4>
          <div className="mb-3">
            <input
              type="radio"
              name="shippingMethod"
              value="GHN - Tiêu chuẩn"
              checked={formData.shippingMethod === "GHN - Tiêu chuẩn"}
              onChange={handleInputChange}
            />
            <label className="ms-2">GHN - Tiêu chuẩn (+ {shippingFee} VND)</label>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="col-md-5">
          <h4>Thông tin đơn hàng</h4>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  <img
                    src={item.imagePath || "https://via.placeholder.com/150"}
                    alt={item.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    className="me-2"
                  />
                  {item.productName}
                </div>
                <div>
                  {item.quantity} x {item.discountPrice || item.regularPrice}{" "}
                  VND
                </div>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Tổng sản phẩm</strong>
              <span>{totalProductPrice.toLocaleString()} VND</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Phí vận chuyển</strong>
              <span>{shippingFee.toLocaleString()} VND</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Tổng tiền</strong>
              <span>{totalPrice.toLocaleString()} VND</span>
            </li>
          </ul>
          <h4 className="mt-3">3. Phương thức thanh toán</h4>
          <div className="mb-3">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH"
              checked={formData.paymentMethod === "CASH"}
              onChange={handleInputChange}
            />
            <label className="ms-2">Thanh toán khi nhận hàng (COD)</label>
          </div>
          <div className="mb-3">
            <input
              type="radio"
              name="paymentMethod"
              value="Online"
              checked={formData.paymentMethod === "Online"}
              onChange={handleInputChange}
            />
            <label className="ms-2">
              Thanh toán thẻ (VNPAY, ATM, VISA, Mastercard,...)
            </label>
          </div>
          <h4 className="mt-3">4. Áp dụng mã giảm giá</h4>
          <div className="mb-3 d-flex">
            <input
              type="text"
              name="discountCode"
              className="form-control"
              placeholder="Nhập mã giảm giá"
              value={formData.discountCode}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary ms-2" onClick={handleApplyDiscount}>
              Sử dụng
            </button>
          </div>
          <button
            className="btn btn-success mt-3 w-100"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
