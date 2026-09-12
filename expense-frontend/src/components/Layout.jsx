// expense-frontend/src/components/Layout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import api from "../api/axios";

function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user || res.data.data || null);
    } catch (err) {
      console.error("ไม่สามารถโหลดข้อมูลผู้ใช้", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar user={user} />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 pb-24 sm:p-6 lg:pb-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default Layout;