import React from "react";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import { Sidebar } from "./sidebar";
import { useSidebarContext } from "../hooks/useSidebarContext";

const MainLayout = () => {
  const { open, handleSidebarToggle } = useSidebarContext();

  return (
    <section className="relative">
      <div className="px-3 h-[70px] lg:py-4 bg-black/95 text-white flex justify-between lg:justify-center items-center">
        <h1 className="text-2xl lg:text-3xl">Dashboard</h1>
        <div
          className=" cursor-pointer flex items-center justify-center lg:hidden"
          onClick={handleSidebarToggle}
        >
          {open ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
      </div>
      <div className="grid lg:grid-cols-5">
        <div
          className={`h-[calc(100vh-70px)] overflow-y-auto top-[70px] bottom-0 ${
            open ? "right-12 left-0" : "left-[-100vw]"
          } absolute lg:static duration-200`}
        >
          <Sidebar />
        </div>
        <main className="col-span-4">
          <article className="flex items-center justify-center py-4">
            <div className="w-[90%] max-w-[1200px]">
              <Outlet />
            </div>
          </article>
        </main>
      </div>
    </section>
  );
};

export default MainLayout;
