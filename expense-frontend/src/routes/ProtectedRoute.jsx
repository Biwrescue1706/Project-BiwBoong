import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProtectedRoute() {
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
        กำลังตรวจสอบการเข้าสู่ระบบ...
      </div>
    );
  }

  return authenticated ? <Outlet /> : <Navigate to="/" replace />;
}
