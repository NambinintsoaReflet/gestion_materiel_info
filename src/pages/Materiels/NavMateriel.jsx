import React from "react";
import { FaBoxes, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const NavMateriel = () => {
  const MaterielMenuItems = [
    {
      to: "/materiels",
      label: "Liste matériels",
      icon: <FaBoxes />,
    },
    {
      to: "/materiels/ajout",
      label: "Ajout matériel",
      icon: <FaPlus />,
    },
  ];

  return (
    <nav className="py-3 border-b border-[#4a4f55]">
      <ul className="flex gap-8">
        {MaterielMenuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              end={item.to === "/materiels"} // <-- active seulement si exact
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

export default NavMateriel;
