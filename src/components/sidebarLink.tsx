import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  icon: ReactNode;
  to: string;
  text: string;
}

export const SidebarLink: FC<Props> = ({ icon, to, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `py-2 px-[10%] flex items-center gap-1 font-semibold duration-200 ${
          isActive ? "bg-white text-black" : "bg-transparent text-white"
        }`
      }
    >
      {icon} {text}
    </NavLink>
  );
};
