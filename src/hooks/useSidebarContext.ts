import { useContext } from "react";

import {
  SidebarContextProps,
  sidebarContext,
} from "../context/sidebar/sidebarContext";

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(sidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider"
    );
  }
  return context;
}
