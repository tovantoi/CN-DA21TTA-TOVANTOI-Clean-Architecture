import React from "react";

const ContactPage = () => {
  return (
    <div className="contact-page container py-5">
      <h1 className="text-center mb-4">Liên hệ với chúng tôi</h1>

      {/* Thông tin liên hệ */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h4>Thông tin liên hệ</h4>
          <p>Công ty Cổ phần Thời Trang Việt Nam</p>
          <p>
            Hotline: <a href="tel:19008079">1900 8079</a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:support@fashionstore.com">
              support@fashionstore.com
            </a>
          </p>
          <p>Địa chỉ: Tầng 17, Tòa nhà Vincom, Quận Hai Bà Trưng, Hà Nội</p>
        </div>
        <div className="col-md-6">
          <h4>Thời gian làm việc</h4>
          <ul>
            <li>Thứ 2 - Thứ 6: 8:30 - 19:00</li>
            <li>Thứ 7: 8:30 - 17:00</li>
            <li>Chủ nhật: Nghỉ</li>
          </ul>
        </div>
      </div>

      {/* Form liên hệ */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h4>Gửi phản hồi</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Tin nhắn
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="5"
                placeholder="Nhập nội dung tin nhắn"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Gửi phản hồi
            </button>
          </form>
        </div>

        {/* Bản đồ */}
        <div className="col-md-6">
          <h4>Bản đồ</h4>
          <iframe
            title="Bản đồ"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5726342320786!2d105.85373661539272!3d21.00925639388813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abbe87084d3f%3A0x476a1f9a752c5b9d!2zVmljb20gTWVnYSBDZW50ZXIgVmluaGNvbSBIw6AgVGjhu4sgSMOgIEzhuq1u!5e0!3m2!1svi!2s!4v1609929385905!5m2!1svi!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
