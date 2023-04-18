import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import { Sidebar } from "./sidebar";
import { useSidebarContext } from "../hooks/useSidebarContext";

const MainLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("filmhouse-token");
    if (!token) {
      navigate("/login");
    }
  });

  const { open, handleSidebarToggle } = useSidebarContext();

  return (
    <section className="relative">
      <div className="px-3 h-[70px] fixed z-10 top-0 left-0 right-0 lg:py-4 bg-black/95 text-white flex justify-between lg:justify-center items-center">
        <h1 className="text-2xl lg:text-3xl">Dashboard</h1>
        <div
          className=" cursor-pointer flex items-center justify-center lg:hidden"
          onClick={handleSidebarToggle}
        >
          {open ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
      </div>
      <div className="grid lg:grid-cols-5">
        <div>
          <div
            className={`h-[calc(100vh-70px)] top-[70px] bottom-0 ${
              open
                ? "right-12 md:right-64 lg:right-auto left-0 lg:w-[20%]"
                : "left-[-100vw] lg:left-0 lg:right-auto lg:w-[20%] right"
            } fixed duration-200`}
          >
            <Sidebar />
          </div>
        </div>
        <main className="col-span-4 py-[70px]">
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
