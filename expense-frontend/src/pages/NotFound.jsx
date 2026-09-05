import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";

function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-green-200/30 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-red-200/20 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 p-6 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:max-w-[480px] sm:rounded-[2rem] sm:p-8 md:max-w-[520px] md:p-10 lg:max-w-[560px] lg:p-12">
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600" />

        <div className="relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <div className="absolute inset-2 rounded-full bg-red-400/20 blur-xl" />
          <div className="absolute inset-0 rounded-full border-4 border-red-100" />
          <div className="absolute inset-2 animate-[spin_12s_linear_infinite] rounded-full border-2 border-dashed border-red-200" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30 sm:h-20 sm:w-20">
            <FaExclamationTriangle className="text-2xl text-white sm:text-3xl" />
          </div>
        </div>

        <div className="mt-5 sm:mt-7">
          <h1 className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-[5rem] font-black leading-none tracking-tight text-transparent sm:text-8xl md:text-9xl">
            404
          </h1>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 sm:w-16" />
        </div>

        <h2 className="mt-5 text-xl font-bold leading-relaxed text-gray-800 sm:mt-6 sm:text-2xl md:text-3xl">
          ไม่พบหน้าที่คุณต้องการ
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7">
          ขออภัย หน้าที่คุณกำลังค้นหาอาจถูกลบ ย้ายตำแหน่ง หรือไม่มีอยู่ในระบบ
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md active:scale-[0.98] sm:w-auto sm:px-6"
          >
            <FaArrowLeft className="text-sm" />
            ย้อนกลับ
          </button>

          <Link
            to="/dashboard"
            className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl active:scale-[0.98] sm:w-auto sm:px-6"
          >
            <FaHome className="transition-transform duration-200 group-hover:scale-110" />
            กลับสู่หน้าหลัก
          </Link>
        </div>

        <div className="mt-7 border-t border-gray-100 pt-4 sm:mt-8 sm:pt-5">
          <p className="text-[11px] text-gray-400 sm:text-xs">
            ระบบบันทึกรายรับรายจ่าย
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
