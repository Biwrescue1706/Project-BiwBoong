import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="relative min-h-dvh overflow-x-clip bg-[#080b19] text-slate-100">
            {/* Background Aurora */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />

                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-[120px]" />
            </div>

            {/* Navigation */}
            <Navbar />

            {/* Page Content */}
            <main className="relative z-10 min-h-[calc(100dvh-64px)] min-w-0 pb-24 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
}