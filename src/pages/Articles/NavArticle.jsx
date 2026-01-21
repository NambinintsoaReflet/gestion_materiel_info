import React from "react";
import { NavLink } from "react-router-dom";
import { FaBoxes, FaArrowDown, FaArrowUp, FaHistory } from "react-icons/fa";
import { GiMovementSensor } from "react-icons/gi";

const NavArticle = () => {
  const ArticleMenuItems = [
    {
      to: "/article",
      label: "Stocks",
      icon: <FaBoxes />,
      exact: true,
    },
    {
      to: "/article/entree",
      label: "Entrée",
      icon: <FaArrowDown className="text-green-500" />,
      exact: false,
    },
    {
      to: "/article/sortie",
      label: "Sortie",
      icon: <FaArrowUp className="text-orange-500" />,
      exact: false,
    },
    {
      to: "/article/mouvement",
      label: "Flux de Stock",
      icon: <FaHistory className="text-blue-500" />,
      exact: false,
    },
  ];

  return (
    <nav className="py-3 border-b border-[#4a4f55] mb-2">
      <ul className="flex gap-8">
        {ArticleMenuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              // "end" assure que le lien n'est pas actif si on est sur une sous-route
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "text-[#61dafb] underline underline-offset-8 decoration-2"
                    : "text-gray-400 hover:text-[#61dafb]"
                }`
              }
            >
              <span className="text-lg mr-2">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavArticle;
