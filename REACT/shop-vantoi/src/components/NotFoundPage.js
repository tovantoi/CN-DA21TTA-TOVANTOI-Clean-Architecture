import React from "react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
       <motion.h1
        //className="dashboard-title"
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
        <p>THE PAGE NOT_FOUND...?</p>
      </motion.h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;
