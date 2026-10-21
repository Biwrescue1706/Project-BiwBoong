import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Borrow from './pages/Borrow.jsx';
import { fetchUserProfile } from './services/auth.js';
import Profile from './pages/Profile.jsx';
import BorrowHistory from './pages/BorrowHistory.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

function AuthGuard({ children, guestOnly = false }) {
  const [status, setStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      setStatus('checking');

      try {
        await fetchUserProfile();

        if (active) {
          setStatus('authenticated');
        }
      } catch {
        if (active) {
          setStatus('unauthenticated');
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">
            กำลังตรวจสอบสถานะเข้าสู่ระบบ...
          </p>
        </div>
      </div>
    );
  }

  if (guestOnly && status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!guestOnly && status !== 'authenticated') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard guestOnly>
            <Login />
          </AuthGuard>
        }
      />

      <Route
        path="/index"
        element={
          <AuthGuard guestOnly>
            <Login />
          </AuthGuard>
        }
      />

      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />

      <Route
        path="/borrow"
        element={
          <AuthGuard>
            <Borrow />
          </AuthGuard>
        }
      />

      <Route
        path="/borrow-history"
        element={
          <AuthGuard>
            <BorrowHistory />
          </AuthGuard>
        }
      />

      <Route
        path="/profile"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}