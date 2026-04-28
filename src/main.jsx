import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/providers/router";
import { AuthProvider } from "@/shared/auth/auth-context";
import "@/app/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider future={{ v7_startTransition: true }} router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
