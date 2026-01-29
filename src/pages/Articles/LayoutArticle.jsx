import React from "react";
import NavArticle from "./NavArticle";
import { Outlet } from "react-router-dom";

const LayoutArticle = () => {
  return (
    <div>
      <h2 className="text-md font-bold text-[#61dafb] uppercase tracking-wider">
        STOCKS
      </h2>
      <NavArticle />
      <Outlet />
    </div>
  );
};

export default LayoutArticle;
