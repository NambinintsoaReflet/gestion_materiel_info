import { useState } from "react";
import { MenuContext } from "./MenuContext";

const MenuContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    console.log({ open });
    setOpen((prev) => !prev);
  };

  return (
    <MenuContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;