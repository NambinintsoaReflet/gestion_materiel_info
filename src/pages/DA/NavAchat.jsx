import React from "react";
import { NavLink } from "react-router-dom";
import { FaBoxes, FaPlus } from "react-icons/fa";

const NavAchat = () => {
  const AchatMenuItems = [
    { to: "/achat", label: "Liste demande d'achat", icon: <FaBoxes /> },
    { to: "/achat/ajout", label: "Ajouter un DA", icon: <FaPlus /> },
  ];

  return (
    <nav className="py-3 border-b border-[#4a4f55]">
      <ul className="flex gap-8">
        {AchatMenuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              end={item.to === "/achat"} // <-- active seulement si exact
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

export default NavAchat;
