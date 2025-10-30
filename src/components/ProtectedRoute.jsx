// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Chargement from "./Chargement";

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // ou user, selon ton contexte
  const location = useLocation();

  if (loading) {
    return <Chargement />; // ou spinner
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
