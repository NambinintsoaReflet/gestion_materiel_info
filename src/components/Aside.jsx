import { NavLink } from "react-router-dom";
import { FaChartBar, FaCog, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { SiMaterialformkdocs } from "react-icons/si";
import { MdOutlineManageHistory } from "react-icons/md";

const menuItems = [
  { to: "/", icon: <FaTachometerAlt className="p-1" />, label: "Dashboard" },
  {
    to: "/materiels",
    icon: <SiMaterialformkdocs className="p-1" />,
    label: "Materiels",
  },
  {
    to: "/suivie",
    icon: <MdOutlineManageHistory className="p-1" />,
    label: "Suivie",
  },
  { to: "/personnel", icon: <FaUsers className="p-1" />, label: "Personnels" },
  { to: "/reports", icon: <FaChartBar className="p-1" />, label: "Rapports" },
  { to: "/settings", icon: <FaCog className="p-1" />, label: "Paramètres" },
  {
    to: "/help",
    icon: <IoIosHelpCircleOutline className="p-1" />,
    label: "Aide",
  },
];

const Aside = () => {
  return (
    <div className="fixed h-screen mt-22 w-16 border-r border-[#3c4c51]">
      <ul className="flex flex-col items-center gap-3 mt-2">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full flex justify-center group relative">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `text-3xl cursor-pointer w-full flex justify-center transition-colors
                 ${
                   isActive
                     ? "text-[#61dafb] border-r-4 border-[#61dafb]"
                     : "text-gray-500 hover:text-[#61dafb] "
                 }`
              }
            >
              {item.icon}
            </NavLink>

            {/* Tooltip */}
            <span
              className="absolute left-16 top-1/2 -translate-y-1/2 
                             bg-gray-800 text-white text-sm rounded px-2 py-1 
                             hidden group-hover:block whitespace-nowrap z-50"
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Aside;
