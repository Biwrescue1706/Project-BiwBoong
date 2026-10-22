import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative isolate flex min-h-[calc(100dvh-64px)] items-center justify-center overflow-hidden bg-[#080b19] px-4 py-16 text-slate-100">
      {/* Aurora Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-cyan-400/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
          <SearchX className="h-10 w-10 text-cyan-300" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Page Not Found
        </p>

        <h1 className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300 bg-clip-text text-8xl font-black tracking-tight text-transparent sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
          ไม่พบหน้าที่คุณกำลังค้นหา
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
          ขออภัย หน้านี้อาจถูกย้าย ลบออก หรือคุณอาจพิมพ์ URL ไม่ถูกต้อง
          ลองกลับไปยังหน้าหลักอีกครั้งนะครับ
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20"
          >
            <Home className="h-4 w-4" />
            กลับหน้าหลัก
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 font-semibold text-slate-200 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            ย้อนกลับ
          </button>
        </div>

        <div className="mt-12 text-xs text-slate-600">
          Error Code: 404 · Page Not Found
        </div>
      </div>
    </div>
  );
}