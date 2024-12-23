import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate(); // Khởi tạo navigate
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleQuantityChange = (index, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      total + (item.discountPrice || item.regularPrice) * item.quantity,
    0
  );

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart"); // Xoá nếu giỏ hàng trống
    }
  }, [cart]);

  const handleAddToCart = (product) => {
    if (!user) {
      // Nếu người dùng chưa đăng nhập, yêu cầu đăng nhập
      Swal.fire({
        title: "Bạn cần đăng nhập để xem và thêm sản phẩm vào giỏ hàng.",
        text: user.message || "Vui lòng kiểm tra lại thông tin đăng nhập.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
      navigate("/login"); // Điều hướng đến trang đăng nhập
      return;
    }

    // Nếu đã đăng nhập, thêm sản phẩm vào giỏ hàng
    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
  };

  // Nếu người dùng chưa đăng nhập, hiển thị thông báo và yêu cầu đăng nhập
  if (!user) {
    return (
      <div className="container my-4">
        <h2 className="text-center">Giỏ hàng</h2>
        <p className="text-center">
          Bạn cần đăng nhập để xem và thêm sản phẩm vào giỏ hàng.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/login")} // Chuyển hướng đến trang đăng nhập
        >
          Đăng nhập
        </button>
      </div>
    );
  }
  return (
    <div className="container my-4">
      <h2 className="text-center">Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p className="text-center">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          <div className="row">
            {cart.map((item, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card h-100">
                  <img
                    src={
                      item.imagePath && item.imagePath !== "string"
                        ? `https://localhost:7241/${item.imagePath}`
                        : "https://via.placeholder.com/400"
                    }
                    className="card-img-top"
                    alt={item.productName}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.productName}</h5>
                    <p className="card-text">
                      Giá: {item.discountPrice || item.regularPrice} VND
                    </p>
                    <div>
                      <label>Số lượng: </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="form-control w-50 d-inline-block"
                      />
                    </div>
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Xóa khỏi giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4>Tổng tiền: {totalPrice.toLocaleString()} VND</h4>
            <button
              className="btn btn-success"
              onClick={() => navigate("/checkout")} // Điều hướng đến trang thanh toán
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
