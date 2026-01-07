import React from "react";
import { NavLink } from "react-router-dom";

const NavPersonnel = () => {
  const PersonnelMenuItems = [
    { to: "/personnel", label: "Liste personnel" },
    { to: "/personnel/ajout", label: "Ajouter un personnel" },
  ];

  return (
    <nav className="py-3">
      <ul className="flex gap-8">
        {PersonnelMenuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              end={item.to === "/personnel"} // <-- active seulement si exact
              className={({ isActive }) =>
                `flex flex-col items-center text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "text-[#61dafb] underline underline-offset-8 decoration-2"
         : "text-gray-400 hover:text-[#61dafb]"
     }`
              }
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavPersonnel;
