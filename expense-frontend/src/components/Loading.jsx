import { FaWallet } from "react-icons/fa";

function Loading() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center">
      {/* Loading Icon */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Glow */}
        <div className="absolute inset-2 rounded-full bg-green-400/20 blur-xl"></div>

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>

        {/* Spinning ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-600 border-r-green-500"></div>

        {/* Inner circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
          <FaWallet className="text-2xl text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-gray-800">
          กำลังโหลดข้อมูล
          <span className="inline-flex w-6 text-left">
            <span className="animate-pulse">...</span>
          </span>
        </h3>

        <p className="mt-2 text-sm text-gray-500">กรุณารอสักครู่</p>
      </div>

      {/* Loading bar */}
      <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
}

export default Loading;
