import React from "react";
import NavMateriel from "./NavMateriel";
import { Outlet } from "react-router-dom";

const LayoutMateriel = () => {
  return (
    <>
      <h2 className="text-md font-bold text-[#61dafb] uppercase tracking-wider">
        MATERIELS
      </h2>
      <NavMateriel />
      <Outlet />
    </>
  );
};

export default LayoutMateriel;
