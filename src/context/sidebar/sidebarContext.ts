import { createContext } from "react";

export interface SidebarContextProps {
  open: boolean;
  handleSidebarToggle: () => void;
}

export const sidebarContext = createContext<SidebarContextProps>({
  open: false,
  handleSidebarToggle: () => {},
});
