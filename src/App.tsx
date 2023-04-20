import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SidebarContextProvider from "./context/sidebar/sidebarContextProvider";
import { fetchEvents, fetchEventDetails } from "./queries";
import { FullScreenLoader, ErrorBoundary } from "./components";

const MainLayout = lazy(() => import("./layout/mainLayout"));

const Home = lazy(() => import("./pages/home"));
const NotFound = lazy(() => import("./pages/notFound"));
const Tickets = lazy(() => import("./pages/tickets"));
const Login = lazy(() => import("./pages/login"));
const Events = lazy(() => import("./pages/events"));
const EventDetail = lazy(() => import("./pages/events/eventDetail"));

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
        errorElement: <ErrorBoundary />,
      },
      {
        path: "events/:eventId",
        element: (
          <Suspense fallback={<FullScreenLoader />}>
            <EventDetail />
          </Suspense>
        ),
        loader: async ({ params }) => {
          const routeParams = params as any;
          return fetchEventDetails(routeParams?.eventId);
        },
        errorElement: <ErrorBoundary />,
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
