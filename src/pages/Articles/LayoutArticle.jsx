import React from "react";
import NavArticle from "./NavArticle";
import { Outlet } from "react-router-dom";

const LayoutArticle = () => {
  return (
    <div>
      <NavArticle />
      <Outlet />
    </div>
  );
};

export default LayoutArticle;
