import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("./pages/home"));
const Events = lazy(() => import("./pages/events"));
const NotFound = lazy(() => import("./pages/notFound"));
const Login = lazy(() => import("./pages/login"));
const MainLayout = lazy(() => import("./layout/mainLayout"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<h1>Loading....</h1>}>
        <Login />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<h1>Loading....</h1>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/events",
        element: (
          <Suspense fallback={<h1>Loading....</h1>}>
            <Events />
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
