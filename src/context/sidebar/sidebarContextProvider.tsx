import { useState, ReactNode, FC } from "react";
import { sidebarContext } from "./sidebarContext";

interface Props {
  children: ReactNode;
}

const SidebarContextProvider: FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleSidebarToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <sidebarContext.Provider value={{ open, handleSidebarToggle }}>
      {children}
    </sidebarContext.Provider>
  );
};

export default SidebarContextProvider;
