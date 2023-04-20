import React from "react";
import { Header } from "../components";
import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError() as any;
  return (
    <div>
      <Header level={2} text="Error Occured while fetching data" />
      <p>
        {error?.response?.data?.message ??
          error?.message ??
          "Something went wrong"}
      </p>
    </div>
  );
};
