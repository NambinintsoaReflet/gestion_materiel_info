import React from "react";
import NavAchat from "./NavAchat";
import { Outlet } from "react-router-dom";

const LayoutAchat = () => {
  return (
    <div>
      <NavAchat />
      <Outlet />
    </div>
  );
};

export default LayoutAchat;
