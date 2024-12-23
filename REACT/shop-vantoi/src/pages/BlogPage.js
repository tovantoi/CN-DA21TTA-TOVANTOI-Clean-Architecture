import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BlogPage = () => {
  // Danh sách bài viết mẫu
  const [posts] = useState([
    {
      id: 1,
      title: "Phong cách tối giản",
      excerpt:
        "Khám phá phong cách thời trang tối giản với sự tinh tế và đơn giản.",
      image: "./assets/blog4.jpg",
      content: `
        <p><strong>Phong cách tối giản</strong> là xu hướng hiện đại, tập trung vào những đường nét cơ bản và sự tối giản trong thiết kế. Màu sắc trung tính, ít họa tiết và phụ kiện là đặc điểm nổi bật.</p>
        <ul>
          <li>Trang phục với tông màu trung tính như trắng, đen, xám.</li>
          <li>Hạn chế phụ kiện và ưu tiên chất liệu cao cấp.</li>
          <li>Đơn giản nhưng vẫn tạo điểm nhấn bằng kiểu dáng.</li>
        </ul>
      `,
    },
    {
      id: 2,
      title: "Phong cách công sở",
      excerpt:
        "Những bộ trang phục công sở thanh lịch dành cho môi trường làm việc chuyên nghiệp.",
      image: "./assets/blog3.jpg",
      content: `
        <p>Phong cách công sở mang đến sự thanh lịch, chuyên nghiệp và thoải mái trong môi trường làm việc. Đừng ngại thử các gam màu tươi sáng hoặc họa tiết nhã nhặn.</p>
        <ul>
          <li>Sử dụng blazer để tạo sự chỉn chu.</li>
          <li>Kết hợp váy bút chì với áo sơ mi hoặc áo blouse.</li>
          <li>Phụ kiện đơn giản như đồng hồ hoặc vòng cổ mảnh.</li>
        </ul>
      `,
    },
    {
      id: 3,
      title: "Phong cách dạo phố",
      excerpt:
        "Phong cách năng động và thoải mái dành cho những buổi dạo chơi cùng bạn bè.",
      image: "./assets/blog2.jpg",
      content: `
        <p>Đây là phong cách lý tưởng cho các hoạt động ngoài trời, nhấn mạnh sự thoải mái và cá tính.</p>
        <ul>
          <li>Áo thun oversized và quần jeans.</li>
          <li>Giày thể thao và mũ lưỡi trai làm điểm nhấn.</li>
          <li>Sử dụng balo hoặc túi chéo năng động.</li>
        </ul>
      `,
    },
    {
      id: 4,
      title: "Phong cách dân chơi",
      excerpt:
        "Phong cách nổi bật dành cho những ai yêu thích sự cá tính và phá cách.",
      image: "./assets/blog1.jpg",
      content: `
        <p>Phong cách này thể hiện sự tự do và không ngại nổi bật giữa đám đông.</p>
        <ul>
          <li>Áo khoác bomber phối cùng quần cargo.</li>
          <li>Kính râm bản to và giày sneaker độc đáo.</li>
          <li>Sử dụng phụ kiện nổi bật như dây chuyền bản lớn.</li>
        </ul>
      `,
    },
  ]);

  const [selectedPostId, setSelectedPostId] = useState(null);

  // Lấy bài viết đã chọn
  const selectedPost = posts.find((post) => post.id === selectedPostId);

  return (
    <div className="container py-5">
      {selectedPostId ? (
        // Trang chi tiết bài viết
        <div>
          {/* <button
            onClick={() => setSelectedPostId(null)}
            className="btn btn-primary mb-4"
          >
            ← Quay lại
          </button> */}
          <h1 className="mb-3">{selectedPost.title}</h1>
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="img-fluid rounded mb-4"
          />
          <div dangerouslySetInnerHTML={{ __html: selectedPost.content }}></div>
        </div>
      ) : (
        // Danh sách bài viết
        <div>
          <h1 className="mb-4 text-center">Blog - Phong cách</h1>
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.id} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="card h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
