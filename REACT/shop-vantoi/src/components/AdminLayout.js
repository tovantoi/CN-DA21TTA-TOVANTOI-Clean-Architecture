// components/AdminLayout.js
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div>
      {/* Không có Header và Footer cho Admin */}
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;
