import React from "react";
import { NavLink } from "react-router-dom";
import { BsFillBarChartFill } from "react-icons/bs";
import { FaTicketAlt } from "react-icons/fa";
import { TbMovie } from "react-icons/tb";

import { useSidebarContext } from "../hooks/useSidebarContext";
import { SidebarLink } from "../components";

const links = [
  { id: 1, text: "Dashboard", icon: <BsFillBarChartFill />, to: "/" },
  { id: 2, text: "Tickets", icon: <FaTicketAlt />, to: "/tickets" },
  { id: 3, text: "Events", icon: <TbMovie />, to: "/events" },
];

export const Sidebar = () => {
  const { handleSidebarToggle } = useSidebarContext();

  const handleLogout = () => {
    alert("Logout functionality to be implemented");
  };
  return (
    <div className="h-full bg-black/95 text-white flex flex-col justify-between border-[0.5px] border-black/95">
      <nav className="flex flex-col w-full gap-4" onClick={handleSidebarToggle}>
        {links.map(({ id, icon, text, to }) => (
          <SidebarLink key={id} icon={icon} to={to} text={text} />
        ))}
      </nav>
      <nav className="flex justify-center items-center px-3 py-4 w-full">
        <button
          onClick={handleLogout}
          className="bg-red-800 text-white py-2 rounded-md px-3 active:ring-2 active:ring-red-800 w-[80%] font-semibold"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};
