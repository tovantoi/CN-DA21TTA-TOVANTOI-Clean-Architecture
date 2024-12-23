import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    description: "",
    parentId: null,
    isActive: true,
    imageData: null,
    imagePath: "", // Thêm imagePath để chứa đường dẫn hình ảnh cũ
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch category data when the component is mounted
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-category-by-id?id=${id}`
        );
        if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm.");
        const data = await response.json();
        setCategory(data); // Cập nhật state sản phẩm
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input change (this is where we handle image selection)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory((prevState) => ({
          ...prevState,
          imageData: reader.result, // Update the imageData to show the selected image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/update-category?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...category,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.isSuccess) {
        Swal.fire({
          title: "Chỉnh sửa danh mục thành công!",
          text: result.message || "Chào mừng bạn!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setTimeout(() => {
          navigate("/admin/category");
        }, 1500);
      } else {
        setError("Error updating category");
      }
    } catch (err) {
      Swal.fire({
        title: "Chỉnh sửa danh mục thất bại!",
        text: err.message || "Chào mừng bạn!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Category</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={category.description || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="parentId">Parent ID</label>
          <input
            type="number"
            id="parentId"
            name="parentId"
            value={category.parentId || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Hiển thị hình ảnh cũ nếu có */}
        {category.imagePath && !category.imageData && (
          <div className="form-group">
            <label>Current Image</label>
            <div>
              <img
                src={
                  category.imagePath && category.imagePath !== "string"
                    ? `https://localhost:7241/${category.imagePath}`
                    : "https://via.placeholder.com/400"
                }
                alt={category.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="imageData">Category Image</label>
          <input
            type="file"
            id="imageData"
            name="imageData"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        {/* Hiển thị hình ảnh mới khi người dùng chọn ảnh mới */}
        {category.imageData && (
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <img
                src={category.imageData}
                alt={category.name || "Ảnh sản phẩm"}
                className="img-thumbnail me-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <span className="text-muted">Hình ảnh xem trước</span>
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="isActive">Active</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={category.isActive || false}
            onChange={(e) =>
              handleChange({
                target: { name: "isActive", value: e.target.checked },
              })
            }
            className="form-check-input"
          />
        </div>
        <br />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
