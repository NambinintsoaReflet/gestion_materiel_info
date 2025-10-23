import React from "react";
import NavMateriel from "./NavMateriel";
import { Outlet } from "react-router-dom";

const LayoutMateriel = () => {
  return (
    <>
      <NavMateriel />
      <Outlet />
    </>
  );
};

export default LayoutMateriel;
