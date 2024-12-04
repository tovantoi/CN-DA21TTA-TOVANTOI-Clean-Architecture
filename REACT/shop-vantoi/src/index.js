import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Lấy phần tử `root` từ DOM
const container = document.getElementById("root");
const root = createRoot(container); // Tạo root bằng createRoot()

// Hiển thị ứng dụng
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
