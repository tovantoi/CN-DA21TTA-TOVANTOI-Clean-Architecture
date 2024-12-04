import React from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";

const HomePage = () => {
  return (
    <div>
      <main>
        <Banner />
        <section id="categories">
          <h2>Danh mục sản phẩm</h2>
          <CategoryList />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
