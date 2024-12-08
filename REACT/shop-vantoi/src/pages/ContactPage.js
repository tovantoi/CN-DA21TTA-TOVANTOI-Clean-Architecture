import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage("");
    setErrorMessage("");

    // Validate input fields
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    emailjs
      .send(
        "service_50yvdrt", // Replace with your Service ID
        "template_wfeplcj", // Replace with your Template ID
        formData,
        "HF6Wcu5eZUxx-qnE4" // Replace with your Public Key
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSuccessMessage("Phản hồi của bạn đã được gửi thành công!");
          setErrorMessage("");
          setFormData({ name: "", email: "", message: "" }); // Clear form
        },
        (err) => {
          console.error("FAILED...", err);
          setErrorMessage("Không thể gửi phản hồi. Vui lòng thử lại sau.");
        }
      );
  };

  return (
    <div className="contact-page container py-5">
      <h1 className="text-center mb-4">Liên hệ với chúng tôi</h1>
      <div className="row">
        {/* Form Liên Hệ - Cột trái */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={handleInputChange}
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
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="message"
                rows="5"
                placeholder="Nhập nội dung tin nhắn"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Gửi phản hồi
            </button>
          </form>
        </div>

        {/* Thông tin liên hệ và bản đồ - Cột phải */}
        <div className="col-md-6">
          {/* Thông tin liên hệ */}
          <h4>Thông tin liên hệ</h4>
          <p>Công ty Cổ phần Thời Trang Việt Nam</p>
          <p>
            Hotline: <a href="tel:19008079">1900 8079</a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:tovantoi@fashionstore.com">
              support@fashionstore.com
            </a>
          </p>
          <p>Địa chỉ: Tầng 17, Tòa nhà Vincom, Phường 5, Trà Vinh</p>
          <hr />

          {/* Bản đồ */}
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
