// expense-frontend/src/components/BottomNav.jsx

import {
  FaChartPie,
  FaMoneyBillWave,
  FaPlus,
  FaWallet,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menus = [
  {
    name: "หน้าหลัก",
    icon: <FaChartPie />,
    path: "/dashboard",
  },
  {
    name: "รายการ",
    icon: <FaMoneyBillWave />,
    path: "/transactions",
  },
  {
    name: "เพิ่ม",
    icon: <FaPlus />,
    path: "/add-transaction",
    add: true,
  },
  {
    name: "บัญชี",
    icon: <FaWallet />,
    path: "/account-summary",
  },
  {
    name: "ตั้งค่า",
    icon: <FaCog />,
    path: "/setting",
  },
];

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] md:hidden">
      <div className="mx-auto flex h-[72px] max-w-xl items-center justify-around px-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex h-full flex-1 flex-col items-center justify-center gap-1 text-xs transition ${
                menu.add
                  ? ""
                  : isActive
                    ? "font-semibold text-green-500"
                    : "text-gray-400 hover:text-green-500"
              }`
            }
          >
            {menu.add ? (
              <div className="flex h-12 w-12 -translate-y-4 items-center justify-center rounded-full bg-green-500 text-white shadow-lg ring-4 ring-white">
                <FaPlus className="text-xl" />
              </div>
            ) : (
              <>
                <span className="text-xl">{menu.icon}</span>
                <span>{menu.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;