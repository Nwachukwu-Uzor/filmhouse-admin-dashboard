import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SidebarContextProvider from "./context/sidebar/sidebarContextProvider";
import { fetchEvents } from "./queries";
import { FullScreenLoader } from "./components";

const MainLayout = lazy(() => import("./layout/mainLayout"));

const Home = lazy(() => import("./pages/home"));
const Events = lazy(() => import("./pages/events"));
const NotFound = lazy(() => import("./pages/notFound"));
const Tickets = lazy(() => import("./pages/tickets"));
const Login = lazy(() => import("./pages/login"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<FullScreenLoader />}>
        <Login />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<FullScreenLoader />}>
        <SidebarContextProvider>
          <MainLayout />
        </SidebarContextProvider>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<FullScreenLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/events",
        element: (
          <Suspense fallback={<FullScreenLoader />}>
            <Events />
          </Suspense>
        ),
        loader: fetchEvents,
      },
      {
        path: "/tickets",
        element: (
          <Suspense fallback={<FullScreenLoader />}>
            <Tickets />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
