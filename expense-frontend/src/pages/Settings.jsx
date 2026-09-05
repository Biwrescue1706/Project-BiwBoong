import {
  FaUser,
  FaLock,
  FaTags,
  FaList,
  FaUsers,
  FaChevronRight,
  FaCog,
  FaShieldAlt,
  FaWallet,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "ข้อมูลส่วนตัว",
      description: "จัดการชื่อ อีเมล เบอร์โทรศัพท์ และข้อมูลบัญชี",
      icon: <FaUser />,
      path: "/profile",
      iconClass: "bg-blue-100 text-blue-600",
      hoverClass: "group-hover",
    },
    {
      title: "เปลี่ยนรหัสผ่าน",
      description: "เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบ",
      icon: <FaLock />,
      path: "/change-password",
      iconClass: "bg-orange-100 text-orange-600",
      hoverClass: "group-hover",
    },
    {
      title: "ประเภท",
      description: "จัดการประเภทของรายรับและรายจ่าย",
      icon: <FaTags />,
      path: "/types",
      iconClass: "bg-green-100 text-green-600",
      hoverClass: "group-hover",
    },
    {
      title: "หมวดหมู่",
      description: "จัดการหมวดหมู่รายรับและรายจ่าย",
      icon: <FaList />,
      path: "/categories",
      iconClass: "bg-purple-100 text-purple-600",
      hoverClass: "group-hover",
    },
    {
      title: "บัญชีเงิน",
      description: "จัดการบัญชีและยอดเงินของคุณ",
      icon: <FaWallet />,
      path: "/accounts",
      iconClass: "bg-cyan-100 text-cyan-600",
      hoverClass: "group-hover",
    },
    {
      title: "สมาชิก",
      description: "จัดการข้อมูลสมาชิกและผู้ใช้งานระบบ",
      icon: <FaUsers />,
      path: "/register",
      iconClass: "bg-pink-100 text-pink-600",
      hoverClass: "group-hover",
    },
  ];

  return (
    <div className="min-h-full bg-slate-50/60 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <section className=" relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 text-white shadow-lg shadow-green-600/10 sm:p-6 md:p-7 " >
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div
              className="
            flex h-12 w-12 flex-shrink-0 items-center justify-center
            rounded-2xl bg-white/15 text-xl backdrop-blur-sm
            sm:h-14 sm:w-14 sm:text-2xl
          "
            >
              <FaCog />
            </div>

            <div>
              <h1
                className="
              text-2xl font-extrabold tracking-tight
              sm:text-3xl
            "
              >
                ตั้งค่า
              </h1>

              <p className="mt-1 text-sm text-white sm:text-base">
                จัดการข้อมูลและการตั้งค่าของระบบ
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {menus.map((menu) => (
            <button
              key={menu.path}
              type="button"
              onClick={() => navigate(menu.path)}
              className="
            group relative flex min-h-[112px] w-full items-center
            gap-4 overflow-hidden rounded-2xl border border-gray-100
            bg-white p-4 text-left shadow-sm transition-all duration-300
            hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg
            active:scale-[0.99] sm:p-5
          "
            >
              <div
                className="
              pointer-events-none absolute -right-10 -top-10 h-28 w-28
              rounded-full bg-gray-50 transition-transform duration-500
              group-hover:scale-150
            "
              />

              <div
                className={`
              relative flex h-12 w-12 flex-shrink-0 items-center
              justify-center rounded-xl text-lg transition-all duration-300
              sm:h-14 sm:w-14 sm:text-xl
              ${menu.iconClass}
              ${menu.hoverClass}
              group-hover:text-white
              group-hover:shadow-lg
            `}
              >
                {menu.icon}
              </div>

              <div className="relative min-w-0 flex-1">
                <h2
                  className="
                text-base font-bold text-black
                sm:text-lg
              "
                >
                  {menu.title}
                </h2>

                <p
                  className="
                mt-1 text-xs font-medium leading-5 text-black
                sm:text-sm
              "
                >
                  {menu.description}
                </p>
              </div>

              <div
                className="
              relative flex h-9 w-9 flex-shrink-0 items-center
              justify-center rounded-full bg-gray-50 text-black
              transition-all duration-300
              group-hover:bg-green-50 group-hover:text-green-600
            "
              >
                <FaChevronRight
                  className="
                text-xs transition-transform duration-300
                group-hover:translate-x-0.5
              "
                />
              </div>
            </button>
          ))}
        </section>

        <section
          className="
        mt-5 overflow-hidden rounded-2xl border border-green-100
        bg-green-50/70 p-4 sm:p-5
      "
        >
          <div className="flex items-start gap-3">
            <div
              className="
            flex h-10 w-10 flex-shrink-0 items-center justify-center
            rounded-xl bg-green-100 text-green-600
          "
            >
              <FaShieldAlt />
            </div>

            <div>
              <h3 className="text-sm font-bold text-black sm:text-base">
                การตั้งค่าบัญชี
              </h3>

              <p className="mt-1 text-xs font-medium leading-5 text-black sm:text-sm">
                คุณสามารถจัดการข้อมูลส่วนตัว รหัสผ่าน ประเภท หมวดหมู่
                บัญชีเงิน และสมาชิกของระบบได้จากเมนูด้านบน
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
}

export default Settings;