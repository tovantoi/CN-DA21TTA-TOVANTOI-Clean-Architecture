import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate(); // Khởi tạo navigate

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

  return (
    <div className="container my-4">
      <h2 className="text-center">Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p className="text-center">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          <div className="row">
            {cart.map((item, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card h-100">
                  <img
                    src={item.imagePath || "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt={item.productName}
                    style={{ height: "150px", objectFit: "cover" }}
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
