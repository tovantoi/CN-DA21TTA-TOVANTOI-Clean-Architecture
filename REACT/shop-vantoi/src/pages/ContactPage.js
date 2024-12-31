import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

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
      <motion.h1
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.8, y: -50 }} // Bắt đầu mờ, nhỏ và di chuyển từ trên xuống
        animate={{ opacity: 1, scale: 1, y: 0 }} // Hiển thị rõ, kích thước bình thường và đúng vị trí
        transition={{
          duration: 1.2, // Thời gian thực hiện hiệu ứng
          ease: "easeOut", // Làm mềm hiệu ứng
        }}
        style={
          {
            color: "blueviolet"
          }
        }
        whileHover={{
          scale: 1.1, // Phóng to khi hover
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)", // Ánh sáng khi hover
          color: "#e91e63", // Đổi màu chữ khi hover
        }}
      >
        Liên hệ với chúng tôi
      </motion.h1>
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15720.041799898867!2d106.3379707060428!3d9.933087178846494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a019fdb8a5a1d9%3A0x57bc3f2bb4f54a3a!2zcGjGsOG7nW5nIDUsIFRwLiBUcsOgIFZpbmgsIFRyw6AgVmluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1735655185804!5m2!1svi!2s"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
