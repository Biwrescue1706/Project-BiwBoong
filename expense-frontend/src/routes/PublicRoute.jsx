import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PublicRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    api
      .get("/auth/profile")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        กำลังตรวจสอบ...
      </div>
    );
  }

  return authenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
