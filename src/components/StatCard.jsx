import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header flex items-center gap-2">
        <h3 className="stat-card-title  text-gray-200">{title}</h3>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold mt-2">{value}</p>
        <button className="px-2 p-1 rounded rounded-md bg-[#4face4] text-[12px]">Details</button>
      </div>
    </div>
  );
};

export default StatCard;
