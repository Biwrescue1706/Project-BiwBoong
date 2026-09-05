import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      await api.get("/auth/profile");
      setAuthenticated(true);
    } catch (err) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
