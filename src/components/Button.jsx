import React from "react";
import { FaPlus } from "react-icons/fa";

// On utilise la destructuration pour récupérer onClick et label
const Button = ({ onClick, label, icon, type }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="flex items-center gap-2 rounded-md py-1.5 px-3 text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all outline-none shadow-md"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default Button;