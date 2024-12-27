import React, { useState } from "react";
import AddressForm from "../components/AddressForm";
import Swal from "sweetalert2";

const CheckoutPage = ({ cart, setCart }) => {
  const [formData, setFormData] = useState({
    // email: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    note: "",
    paymentMethod: "",
    orderItems: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [customerAddressId, setCustomerAddressId] = useState(null);

  const handleSaveAddress = async () => {
    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        Swal.fire({
          title: "Thêm sản phẩm thất bại",
          text: user.message || "Bạn cần đăng nhập để tạo địa chỉ.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }

      const customerId = user.id;

      // Gửi yêu cầu tạo địa chỉ
      const response = await fetch(
        "https://localhost:7022/minimal/api/create-customeraddress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            fullName: formData.fullName,
            phone: formData.phone,
            province: formData.city,
            district: formData.district,
            ward: formData.ward,
            address: formData.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "Không thể tạo địa chỉ giao hàng.");
      }

      // Lấy ID từ phản hồi
      const addressId = data.query?.id;
      if (!addressId) {
        throw new Error("Không nhận được ID từ API.");
      }

      // Cập nhật state với `id` của địa chỉ
      setCustomerAddressId(addressId);
      Swal.fire({
        title: "Địa chỉ đã được lưu thành công!",
        text: addressId.message || "Đã lưu địa chỉ!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi lưu địa chỉ.");
    } finally {
      setLoading(false);
    }
  };
  const shippingFee = 30;

  // Tính tổng giá sản phẩm
  const totalProductPrice = cart.reduce(
    (total, item) =>
      total + (item.discountPrice || item.regularPrice) * item.quantity,
    0
  );

  // Tính tổng tiền (bao gồm phí vận chuyển)
  const totalPrice = totalProductPrice + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerAddressId) {
      Swal.fire({
        title: "Thêm sản phẩm thất bại",
        text:
          customerAddressId.message ||
          "Vui lòng lưu địa chỉ trước khi đặt hàng.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("Bạn cần đăng nhập để tạo đơn hàng.");
      }

      const customerId = user.id;

      const orderResponse = await fetch(
        "https://localhost:7022/minimal/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            customerAddressId,
            paymentMethod: formData.paymentMethod,
            orderItems: formData.orderItems,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Không thể tạo đơn hàng.");
      }

      Swal.fire({
        title: "Đơn hàng của bạn đã được đặt thành công!",
        text: orderResponse.message || "Đã đặt!",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (typeof setCart === "function") {
        setCart([]);
      } else {
        console.error("setCart is not a function.");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-code-coupon?couponcode=${formData.discountCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok || !data.isActive) {
        throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }

      if (data.timesUsed >= data.maxUsage) {
        throw new Error("Mã giảm giá đã hết lượt sử dụng.");
      }

      const currentDate = new Date();
      const endDate = new Date(data.couponEndDate);
      if (currentDate > endDate) {
        throw new Error("Mã giảm giá đã hết hạn.");
      }

      setSuccessMessage(`Mã giảm giá hợp lệ! Giảm giá: ${data.discount} VNĐ`);
    } catch (err) {
      setError(err.message || "Không thể áp dụng mã giảm giá.");
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
        <div className="col-md-7">
          <h4>1. Địa chỉ giao hàng</h4>
          <AddressForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSaveAddress}
          />
          {error && <div className="alert alert-danger">{error}</div>}
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
                    src={
                      item.imagePath && item.imagePath !== "string"
                        ? `https://localhost:7241/${item.imagePath}`
                        : "https://via.placeholder.com/400"
                    }
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
              <strong>Tổng giá sản phẩm</strong>
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
            <button
              className="btn btn-primary ms-2"
              onClick={handleApplyDiscount}
            >
              Sử dụng
            </button>
          </div>
          <button
            className="btn btn-success mt-3 w-100"
            onClick={handlePlaceOrder}
            disabled={!customerAddressId || loading} // Nút bị vô hiệu nếu chưa có địa chỉ
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
