import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">CÁC CHỈ TIÊU KINH DOANH</h1>
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
          <span className="value">$59,100</span>
        </div>
        <div className="info-card">
          Chi phí
          <br />
          <span className="value">$26,400</span>
        </div>
        <div className="info-card">
          Lợi nhuận
          <br />
          <span className="value">$49.55</span>
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
          <h3>Sales Rep</h3>
          <div className="sales-card">Anna Krüger: $19,200</div>
          <div className="sales-card">Tobi Schmidt: $22,600</div>
          <div className="sales-card">Lisa Fisher: $13,100</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
