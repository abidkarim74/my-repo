import React, { useContext, ReactNode } from "react";
import { AuthContext } from "./contextProvider.tsx";
import { Navigate } from "react-router-dom";
import {getAuthenticatedUser} from "../api/apiRequests.tsx";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is undefined. Make sure you are using ProtectedRoute within an AuthProvider.");
  }

  const res = authContext

  console.log("Here: ", res);

  return res.authenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
