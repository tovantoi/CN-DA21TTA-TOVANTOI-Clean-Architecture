import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../AdminCss/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const getRandomColor = () => {
    const colors = ["#ff6ec7", "#ff9000", "#00ff90", "#0090ff", "#ff00d8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [color, setColor] = useState(getRandomColor());
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Doanh thu khách hàng mới (triệu đồng)",
        data: [50, 70, 90, 80, 100, 120],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Marketing", "Bán hàng"],
    datasets: [
      {
        label: "Chi phí (%)",
        data: [75, 25],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverOffset: 4,
      },
    ],
  };

  const barChartData = {
    labels: ["Email", "GDN", "Instagram", "Facebook", "Twitter", "Google Ads"],
    datasets: [
      {
        label: "Doanh thu theo kênh (ngàn đồng)",
        data: [10, 15, 12, 8, 7, 18],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#F7464A",
          "#949FB1",
        ],
      },
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(getRandomColor()); // Cập nhật màu sắc sau mỗi 5 giây
    }, 5000); // Thời gian đổi màu là 5 giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
  }, []);
  return (
    <div className="dashboard">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity, // Lặp lại vô hạn
          repeatType: "reverse", // Lặp lại theo chiều ngược lại
          repeatDelay: 2, // Thời gian chờ trước khi lặp lại
        }}
        style={{
          //background: `linear-gradient(45deg, ${color}, #ff9000)`,
          fontSize: 50,
          color: "red",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        <p> CHỈ TIÊU KINH DOANH</p>
      </motion.h1>
      <div className="grid-container">
        {/* Thông tin cơ bản */}
        <div className="info-card">
          Số lượng bán
          <br />
          <span className="value">660</span>
        </div>
        <div className="info-card">
          Doanh thu KH mới
          <br />
          <span className="value">5.9100-VNĐ</span>
        </div>
        <div className="info-card">
          Chi phí
          <br />
          <span className="value">26.4000-VNĐ</span>
        </div>
        <div className="info-card">
          Lợi nhuận
          <br />
          <span className="value">30.5500-VNĐ</span>
        </div>

        {/* Biểu đồ dạng đường */}
        <div className="chart large-chart">
          <h3>Doanh thu từ khách hàng mới</h3>
          <Line
            data={lineChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        {/* Biểu đồ dạng tròn */}
        <div className="chart medium-chart">
          <h3>Thành phần chi phí</h3>
          <Doughnut
            data={doughnutChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        {/* Biểu đồ dạng cột */}
        <div className="chart medium-chart">
          <h3>Doanh thu gia tăng theo kênh</h3>
          <Bar
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        {/* Danh sách Sales Rep */}
        <div className="sales-rep">
          <h3>Đại diện bán hàng</h3>
          <div className="sales-card">Văn Tới: 3.200-VNĐ</div>
          <div className="sales-card">Quốc Ninh: 2.600-VNĐ</div>
          <div className="sales-card">Bá Hiếu: 2.100-VNĐ</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
