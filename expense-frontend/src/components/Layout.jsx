//expense-frontend/src/components/Layout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import api from "../api/axios";

function Layout() {
  const [open, setOpen] = useState(false);
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={open} setOpen={setOpen} user={user} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar setOpen={setOpen} user={user} />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
