import React from "react";
import NavAchat from "./NavAchat";
import { Outlet } from "react-router-dom";

const LayoutAchat = () => {
  return (
    <div>
      <h2 className="text-md font-bold text-[#61dafb] uppercase tracking-wider">
        ACHATS
      </h2>
      <NavAchat />
      <Outlet />
    </div>
  );
};

export default LayoutAchat;
