import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="relative min-h-dvh overflow-x-clip bg-[#FFF8E7] text-stone-800">
            {/* Background Decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-[120px]" />

                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-lime-200/25 blur-[120px]" />

                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-100/40 blur-[120px]" />
            </div>

            {/* Navigation: แสดง Navbar เพียงครั้งเดียว */}
            <Navbar />

            {/* Page Content */}
            <main className="relative z-10 min-h-dvh min-w-0 bg-transparent pb-24 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
}