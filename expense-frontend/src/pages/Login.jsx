import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [installedApp, setInstalledApp] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(
    !!window.__deferredPrompt,
  );

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) setInstalledApp(true);

    const handleInstallAvailable = () => setInstallAvailable(true);
    const handleAppInstalled = () => {
      setInstalledApp(true);
      setInstallAvailable(false);
    };

    if (window.__deferredPrompt) setInstallAvailable(true);

    window.addEventListener("pwa-install-available", handleInstallAvailable);
    window.addEventListener("pwa-installed", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "pwa-install-available",
        handleInstallAvailable,
      );
      window.removeEventListener("pwa-installed", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone || installedApp) {
      Swal.fire({
        icon: "info",
        title: "ติดตั้งแอปแล้ว",
        text: "ระบบบันทึกรายรับรายจ่ายติดตั้งอยู่บนเครื่องนี้แล้ว",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    const promptEvent = window.__deferredPrompt;

    if (!promptEvent) {
      Swal.fire({
        icon: "info",
        title: "ยังไม่พร้อมติดตั้ง",
        html: `
                    <div style="line-height:1.8;">
                        <p>Chrome ยังไม่พร้อมแสดงหน้าต่างติดตั้ง</p>
                        <p style="margin-top:10px;">หากต้องการติดตั้งตอนนี้ ให้กดเมนู <b>⋮</b> ของ Chrome แล้วเลือก <b>ติดตั้งแอป</b></p>
                    </div>
                `,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    try {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;

      if (outcome === "accepted") {
        setInstalledApp(true);
      }

      window.__deferredPrompt = null;
      setInstallAvailable(false);
    } catch (error) {
      console.error("PWA Install Error:", error);

      Swal.fire({
        icon: "error",
        title: "ไม่สามารถติดตั้งแอปได้",
        text: "กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#16a34a",
      });
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/auth/login", form);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text:
          err.response?.data?.message || "Username หรือ Password ไม่ถูกต้อง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center p-3 sm:p-5 md:p-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white flex flex-col justify-center items-center px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-10 lg:py-14">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full bg-white/20 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 p-2">
            <img
              src="/BiwBoong.png"
              alt="BiwBoong Finance"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-center leading-tight mb-3 sm:mb-4">
            BiwBoong Finance
          </h1>

          <h2 className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-bold text-center leading-relaxed max-w-md mb-4 sm:mb-5">
            Personal Income & Expense Management System
          </h2>

          <p className="text-center text-green-100 text-sm sm:text-base md:text-lg lg:text-sm xl:text-base leading-7 sm:leading-8">
            ระบบบันทึกรายรับรายจ่าย
            <br />
            จัดการการเงินของคุณได้ง่าย
            <br />
            ทุกที่ ทุกเวลา
          </p>
        </div>

        <div className="flex items-center p-5 sm:p-8 md:p-10 lg:p-10 xl:p-14">
          <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-7 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-gray-800">
                เข้าสู่ระบบ
              </h2>

              <p className="text-gray-500 text-sm sm:text-base mt-2">
                ยินดีต้อนรับกลับ
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-800 mb-2">
                  Username หรือ Email
                </label>

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username หรือ Email"
                    autoComplete="username"
                    required
                    className="w-full h-12 sm:h-13 md:h-14 pl-11 sm:pl-12 pr-4 text-sm sm:text-base border border-gray-400 rounded-xl bg-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-800 mb-2">
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    autoComplete="current-password"
                    required
                    className="w-full h-12 sm:h-13 md:h-14 pl-11 sm:pl-12 pr-12 text-sm sm:text-base border border-gray-400 rounded-xl bg-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm sm:text-base text-green-600 hover:text-green-700 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-13 md:h-14 bg-green-600 hover:bg-green-700 active:scale-[0.99] transition text-white text-base sm:text-lg rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>

              <button
                type="button"
                onClick={handleInstallApp}
                className="w-full h-12 sm:h-13 md:h-14 border-2 border-green-600 text-green-600 hover:bg-green-50 active:scale-[0.99] transition text-base sm:text-lg rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <FaDownload />
                ติดตั้งแอป
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
