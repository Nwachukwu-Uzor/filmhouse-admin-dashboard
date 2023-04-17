import React from "react";
import { NavLink } from "react-router-dom";
import { useSidebarContext } from "../hooks/useSidebarContext";

export const Sidebar = () => {
  const { handleSidebarToggle } = useSidebarContext();
  return (
    <div className="h-full bg-black/95 text-white flex flex-col justify-between items-center py-4">
      <nav
        className="flex flex-col items-center justify-center gap-3"
        onClick={handleSidebarToggle}
      >
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/tickets">Tickets</NavLink>
      </nav>
      <nav>Sidebar</nav>
    </div>
  );
};
