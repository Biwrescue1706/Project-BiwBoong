//expense-frontend/src/components/Navbar.jsx
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ setOpen, user }) {
  const today = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName =
    user?.fullName ||
    `${user?.prefix || ""}${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.username ||
    "ผู้ใช้งาน";

  const roleName = user?.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก";

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-blue-500 px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="text-gray-700 transition hover:text-blue-600 lg:hidden"
        >
          <FaBars size={20} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <img
            src="/BiwBoong.png"
            alt="logo"
            className="h-8 w-8 object-contain"
          />
        </div>

        <Link to="/dashboard" className="no-underline">
          <h1 className="cursor-pointer text-lg font-bold leading-none text-gray-100">
            ระบบบันทึกรายรับรายจ่าย
          </h1>
        </Link>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-100">{today}</p>
          <p className="text-xs text-gray-200">{roleName}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-100">{displayName}</p>
            <p className="text-xs text-gray-200">@{user?.username || "-"}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
            {(user?.firstName || user?.username || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
