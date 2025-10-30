import { IoIosLogOut } from "react-icons/io";
import logo from "../assets/logo.png";
import { useAuth } from "../Context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion du contexte
  };

  console.log(user.name);

  return (
    <>
      {user && (
        <div className="p-4 fixed w-full bg-[#282c34] z-50">
          <div className="flex w-full items-center gap-3 px-4 py-1 bg-[#20232a] rounded-md shadow-md">
            <img src={logo} alt="Logo" className="w-10 h-auto" />
            <h1 className="font-semibold text-white">IT MANAGER</h1>

            <div
              className="ml-auto flex items-center gap-3 cursor-pointer text-white"
              onClick={handleLogout}
            >
              <h3>{user.name}</h3>
              <IoIosLogOut className="text-[#1E63F0] w-6 h-6" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
