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
  const [highlight, setHighlight] = useState(false);

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
      setColor(getRandomColor());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
        }}
        style={{
          fontSize: 50,
          color: highlight ? "gold" : color,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
        onMouseEnter={() => setHighlight(true)}
        onMouseLeave={() => setHighlight(false)}
      >
        <motion.span
          whileHover={{
            scale: 1.2,
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          CHỈ TIÊU KINH DOANH
        </motion.span>
      </motion.h1>
      <motion.div
        className="grid-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="info-card"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Số lượng bán
          <br />
          <span className="value">660</span>
        </motion.div>
        <motion.div
          className="info-card"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Doanh thu KH mới
          <br />
          <span className="value">5.9100-VNĐ</span>
        </motion.div>
        <motion.div
          className="info-card"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Chi phí
          <br />
          <span className="value">26.4000-VNĐ</span>
        </motion.div>
        <motion.div
          className="info-card"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Lợi nhuận
          <br />
          <span className="value">30.5500-VNĐ</span>
        </motion.div>

        <motion.div
          className="chart large-chart"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Doanh thu từ khách hàng mới</h3>
          <Line
            data={lineChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </motion.div>

        <motion.div
          className="chart medium-chart"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Thành phần chi phí</h3>
          <Doughnut
            data={doughnutChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </motion.div>

        <motion.div
          className="chart medium-chart"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Doanh thu gia tăng theo kênh</h3>
          <Bar
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </motion.div>

        <motion.div
          className="sales-rep"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Đại diện bán hàng</h3>
          <motion.div
            className="sales-card"
            whileHover={{ backgroundColor: "#36A2EB", color: "#fff" }}
          >
            Văn Tới: 3.200-VNĐ
          </motion.div>
          <motion.div
            className="sales-card"
            whileHover={{ backgroundColor: "#FF6384", color: "#fff" }}
          >
            Quốc Ninh: 2.600-VNĐ
          </motion.div>
          <motion.div
            className="sales-card"
            whileHover={{ backgroundColor: "#FFCE56", color: "#fff" }}
          >
            Bá Hiếu: 2.100-VNĐ
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
