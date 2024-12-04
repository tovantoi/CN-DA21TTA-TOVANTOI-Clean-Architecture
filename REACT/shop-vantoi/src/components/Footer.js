import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Thông tin công ty */}
          <div className="col-md-4">
            <h5 className="fw-bold">SHOP VANTOI</h5>
            <p>
              CÔNG TY CỔ PHẦN THỜI TRANG KOWIL VIỆT NAM
              <br />
              Hotline: 1900 8079
              <br />
              8:30 - 19:00 tất cả các ngày trong tuần.
            </p>
            <p>
              <b>VP Phía Bắc:</b> Tầng 17 tòa nhà Viwaseen, 48 Phố Tố Hữu, Trung
              Văn, Nam Từ Liêm, Hà Nội.
            </p>
            <p>
              <b>VP Phía Nam:</b> 186A Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu,
              Quận 3, TP.HCM.
            </p>
          </div>

          {/* Giới thiệu */}
          <div className="col-md-2">
            <h5 className="fw-bold">GIỚI THIỆU OWEN</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Hệ thống cửa hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Liên hệ với Owen
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="col-md-3">
            <h5 className="fw-bold">HỖ TRỢ KHÁCH HÀNG</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Hỏi đáp
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Hướng dẫn chọn kích cỡ
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Hướng dẫn thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Quy định đổi hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-dark text-decoration-none">
                  Hướng dẫn mua hàng
                </a>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div className="col-md-3">
            <h5 className="fw-bold">KẾT NỐI</h5>
            <div className="d-flex mb-3">
              <a
                href="https://www.facebook.com/OWENFashionVN/"
                className="text-dark me-3"
              >
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a
                href="https://www.instagram.com/owen_fashion/"
                className="text-dark me-3"
              >
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a
                href="https://www.youtube.com/c/OwenFashionVN/featured"
                className="text-dark"
              >
                <i className="bi bi-youtube fs-4"></i>
              </a>
            </div>
            <h6 className="fw-bold">PHƯƠNG THỨC THANH TOÁN</h6>
            <div className="d-flex align-items-center">
              <img
                src="/assets/visa.png"
                alt="Visa"
                className="me-2"
                style={{ height: "30px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
