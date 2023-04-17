import React from "react";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";

import { Sidebar } from "./sidebar";
import { useSidebarContext } from "../hooks/useSidebarContext";

const MainLayout = () => {
  const { open, handleSidebarToggle } = useSidebarContext();
  return (
    <section className="grid lg:grid-cols-5">
      <div className="h-screen overflow-y-auto">
        <Sidebar />
      </div>
      <div className="col-span-4">
        <div className="px-3 py-2 lg:py-4 bg-black/95 text-white flex justify-between">
          <h1 className="text-2xl lg:text-3xl">Event Management Dashboard</h1>
          <AiOutlineMenu />
        </div>
        <Outlet />
      </div>
    </section>
  );
};

export default MainLayout;
