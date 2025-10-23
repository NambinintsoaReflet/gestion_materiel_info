import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Aside from "../components/Aside";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Aside />
        <div className="flex-1 p-4 ml-15 mt-20 overflow-auto ">
          <Outlet />
        </div>
      </div>
    </>
  );
};
