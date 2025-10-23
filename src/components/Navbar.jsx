import { IoIosLogOut } from "react-icons/io";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <div className="p-4 fixed w-full bg-[#282c34]">
     <div className="flex w-full items-center gap-3 px-4 py-1 bg-[#20232a] rounded-md shadow-md">
          <img src={logo} alt="" className="w-10 h-auto"/><h1 className="font-semibold">IT MANAGER</h1>
          <div className="ml-auto flex items-center gap-3 cursor-pointer">
            <h3 className="">IT HITA2</h3>
            <IoIosLogOut className="text-[#1E63F0] w-6 h-6"/>
          </div>
        </div>
     </div>

  );
}

export default Navbar;
