import React from "react";

const categories = [
  { id: 1, name: "Hàng mới", image: "/assets/hình1.webp" },
  { id: 2, name: "Áo", image: "/assets/hình2.webp" },
  { id: 3, name: "Quần", image: "/assets/hình3.webp" },
  { id: 4, name: "Phụ kiện", image: "/assets/4.png" },
  { id: 5, name: "Giá tốt", image: "/assets/5.png" },
];

const CategoryList = () => {
  return (
    <div className="category-list">
      {categories.map((category) => (
        <div className="category-item" key={category.id}>
          <img src={category.image} alt={category.name} />
          <p>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
