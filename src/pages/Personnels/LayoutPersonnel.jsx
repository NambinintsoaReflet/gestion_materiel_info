import React from "react";
import { Outlet } from "react-router-dom";
import NavPersonnel from "./NavPersonnel";

const LayoutPersonnel = () => {
  return (
    <div>
      <NavPersonnel />
      <Outlet />
    </div>
  );
};

export default LayoutPersonnel;
