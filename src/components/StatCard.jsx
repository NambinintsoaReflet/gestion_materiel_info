import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header flex items-center gap-2">
        <span className="stat-card-icon text-xl">{icon}</span>
        <h3 className="stat-card-title font-semibold text-gray-200">{title}</h3>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
