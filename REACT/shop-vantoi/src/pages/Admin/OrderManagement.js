import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdownId, setShowDropdownId] = useState(null); // Trạng thái để kiểm soát dropdown

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-orders"
      );
      if (!response.ok) throw new Error("Không thể lấy danh sách đơn hàng.");
      const data = await response.json();
      setOrders(data || []); // Đảm bảo orders luôn là mảng
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi trạng thái từ số sang chữ và màu sắc
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return { label: "Pending", color: "text-warning" }; // Màu vàng
      case 1:
        return { label: "Accepted", color: "text-primary" }; // Màu xanh dương
      case 2:
        return { label: "Shipping", color: "text-info" }; // Màu xanh nhạt
      case 3:
        return { label: "Successed", color: "text-success" }; // Màu xanh lá
      case 4:
        return { label: "Canceled", color: "text-danger" }; // Màu đỏ
      default:
        return { label: "Unknown Status", color: "" };
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = [
      { value: 0, label: "Pending" },
      { value: 1, label: "Accepted" },
      { value: 2, label: "Shipping" },
      { value: 3, label: "Successed" },
      { value: 4, label: "Canceled" },
    ];

    // Tạo dropdown để chọn trạng thái
    const { value: newStatus } = await Swal.fire({
      title: "Chọn trạng thái mới",
      input: "select",
      inputOptions: statuses.reduce((obj, status) => {
        obj[status.value] = status.label; // Sử dụng giá trị số cho inputOptions
        return obj;
      }, {}),
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    });

    if (newStatus !== undefined) {
      try {
        // Gửi yêu cầu cập nhật trạng thái
        const response = await fetch(
          `https://localhost:7022/minimal/api/change-status-order?id=${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: parseInt(newStatus) }), // Chuyển đổi thành số
          }
        );

        if (!response.ok)
          throw new Error("Không thể cập nhật trạng thái đơn hàng.");

        // Cập nhật lại danh sách đơn hàng
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status: parseInt(newStatus) } : order
          )
        );

        await Swal.fire({
          title: "Thành công!",
          text: `Trạng thái đã được cập nhật thành "${
            getStatusLabel(parseInt(newStatus)).label
          }".`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        await Swal.fire({
          title: "Lỗi!",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
  // const addCustomFonts = (doc) => {
  //   doc.addFileToVFS("CustomFont.ttf", "base64_encoded_font_string_here");
  //   doc.addFont("CustomFont.ttf", "CustomFont", "normal");
  //   doc.setFont("CustomFont");
  // };
  const handlePrintInvoice = async (order) => {
    const doc = new jsPDF();
    // addCustomFonts(doc);

    // Tiêu đề hóa đơn
    doc.setFontSize(20);
    doc.text("HÓA ĐƠN", 105, 30, null, null, "center");

    // Thông tin cửa hàng
    doc.setFontSize(12);
    doc.text("Cửa hàng Thời trang XYZ", 14, 50);
    doc.text("Địa chỉ: 123 Đường ABC, Thành phố XYZ", 14, 55);
    doc.text("Điện thoại: 0123-456-789", 14, 60);

    // Lấy thông tin khách hàng từ API
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-order-by-customer-id?id=${order.customerId}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải thông tin khách hàng.");
      }

      const { address } = order;
      const fullName = order.address?.fullName || "N/A";
      const phone = order.address?.phone || "N/A";
      const finalAddress = order.address?.finalAddress || "N/A";

      // Thông tin khách hàng
      doc.text(`Khách hàng: ${fullName}`, 14, 70);
      doc.text(`Số điện thoại: ${phone}`, 14, 75);
      doc.text(`Địa chỉ giao hàng: ${finalAddress}`, 14, 80);

      doc.line(10, 85, 200, 85); // Vẽ đường ngang

      // Bảng sản phẩm
      autoTable(doc, {
        startY: 90,
        head: [["Sản phẩm", "Số lượng", "Giá", "Tổng"]],
        body: (order.orderItems || []).map((item) => [
          item.product.productName || "Tên sản phẩm không có",
          item.quantity || 0,
          `${item.product.price} VND`,
          `${(item.quantity * item.product.price).toLocaleString()} VND`,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 10 },
      });

      const totalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(
        `Tổng tiền: ${order.totalPrice.toLocaleString()} VND`,
        14,
        totalY
      );

      const date = new Date();
      doc.text(
        `Ngày xuất hóa đơn: ${date.toLocaleDateString()}`,
        14,
        totalY + 10
      );

      doc.save(`invoice_order_${order.id}.pdf`);
    } catch (error) {
      Swal.fire({
        title: "Lỗi!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExportToExcel = (order) => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        ID: order.id,
        AddressDelivery: order.customerAddressId,
        PaymentMethod: order.payment,
        TotalPrice: `${order.totalPrice} VND`,
        Status: getStatusLabel(order.status).label,
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order");

    XLSX.writeFile(workbook, `invoice_order_${order.id}.xlsx`);
  };

  // Hàm để hiển thị hộp thoại chọn loại file khi nhấn nút IN
  const handleShowPrintOptions = (order) => {
    Swal.fire({
      title: "Chọn loại file để in",
      text: "Bạn muốn xuất hóa đơn dưới dạng:",
      showCancelButton: true,
      confirmButtonText: "PDF",
      cancelButtonText: "Excel",
    }).then((result) => {
      if (result.isConfirmed) {
        handlePrintInvoice(order); // Gọi hàm in hóa đơn PDF
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        handleExportToExcel(order); // Gọi hàm xuất hóa đơn Excel
      }
    });
  };

  return (
    <motion.div className="container my-4">
      <h1 className="text-center mb-4">Quản lý đơn hàng</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">Đang tải...</div>
      ) : (
        <motion.table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Địa chỉ giao hàng</th>
              <th>Phương thức thanh toán</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const statusInfo = getStatusLabel(order.status);
                return (
                  <motion.tr key={order.id} whileHover={{ scale: 1.02 }}>
                    <td>{order.id}</td>
                    <td>{order.customerAddressId}</td>
                    <td>{order.payment}</td>
                    <td>{order.totalPrice} VND</td>
                    <td className={statusInfo.color}>
                      {statusInfo.label}
                    </td>{" "}
                    {/* Hiển thị trạng thái với màu sắc */}
                    <td>
                      <button
                        className="btn btn-info me-2"
                        onClick={() =>
                          navigate(`/admin/order-detail/${order.id}`)
                        }
                      >
                        Xem chi tiết
                      </button>

                      {/* Nút in hóa đơn */}
                      <button
                        className="btn btn-primary"
                        onClick={() => handleShowPrintOptions(order)} // Hiển thị hộp thoại khi nhấn nút IN
                      >
                        IN
                      </button>

                      {/* Nút chọn trạng thái */}
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          handleStatusChange(order.id, order.status)
                        }
                      >
                        Chọn trạng thái
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      )}
    </motion.div>
  );
};

export default OrderManagement;
