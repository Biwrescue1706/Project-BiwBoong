import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const mainMenu = [
    { to: "/", label: "หน้าหลัก", icon: "⌂", description: "หน้าแรกของเว็บไซต์" },
    { to: "/timetable", label: "ตารางเรียน", icon: "▦", description: "ดูตารางเรียนทั้งหมด" },
    {
        to: "/current-timetable",
        label: "ตารางเรียนปัจจุบัน",
        icon: "▤",
        description: "ตารางเรียนที่ใช้อยู่",
    },
];

const timetableMenu = [
    { to: "/term-1-2568", label: "ภาคเรียนที่ 1/2568" },
    { to: "/term-2-2568", label: "ภาคเรียนที่ 2/2568" },
    { to: "/term-1-2567", label: "ภาคเรียนที่ 1/2567" },
    { to: "/term-2-2567", label: "ภาคเรียนที่ 2/2567" },
    { to: "/term-1-2566", label: "ภาคเรียนที่ 1/2566" },
    { to: "/term-2-2566", label: "ภาคเรียนที่ 2/2566" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);

    const location = useLocation();

    useEffect(() => {
        function handleBeforeInstallPrompt(event) {
            event.preventDefault();
            setInstallPrompt(event);
        }

        function handleAppInstalled() {
            setInstalled(true);
            setInstallPrompt(null);
        }

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.classList.toggle("overflow-hidden", isOpen);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    function isActive(to) {
        if (to === "/") {
            return location.pathname === "/";
        }

        if (to === "/timetable") {
            return (
                location.pathname === "/timetable" ||
                location.pathname === "/timetable/"
            );
        }

        return location.pathname === to;
    }

    function closeDrawer() {
        setIsOpen(false);
    }

    async function installApp() {
        if (!installPrompt) return;

        try {
            await installPrompt.prompt();

            const result = await installPrompt.userChoice;

            console.log("PWA install:", result.outcome);

            if (result.outcome === "accepted") {
                setInstalled(true);
            }
        } catch (error) {
            console.error("PWA installation failed:", error);
        } finally {
            setInstallPrompt(null);
        }
    }

    function renderInstallButton(mobile = false) {
        if (mobile) {
            return (
                <button
                    type="button"
                    onClick={installApp}
                    aria-label="ติดตั้งแอป"
                    className="group flex h-[58px] min-w-[68px] flex-col items-center justify-center gap-1 rounded-2xl text-slate-500 transition active:scale-90"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-lg text-violet-700 transition group-hover:bg-violet-200">
                        ↓
                    </span>
                    <span className="text-[10px] font-bold leading-none">
                        ติดตั้งแอป
                    </span>
                </button>
            );
        }

        return (
            <button
                type="button"
                onClick={installApp}
                className="group flex w-full items-center gap-3 rounded-2xl border border-emerald-300/20 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 p-3 text-left transition hover:border-emerald-300/50 hover:from-emerald-400/25 hover:to-cyan-400/20"
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-xl text-slate-950 shadow-lg">
                    ↓
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-white">
                        ติดตั้งแอป
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                        เพิ่มไว้บนอุปกรณ์ของคุณ
                    </span>
                </span>

                <span className="text-lg text-emerald-300">↗</span>
            </button>
        );
    }

    function renderMenuItem(item) {
        const active = isActive(item.to);

        return (
            <NavLink
                key={item.to}
                to={item.to}
                onClick={closeDrawer}
                end={item.to === "/"}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-2xl p-3 transition-all duration-200 ${active
                        ? "bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950 shadow-lg shadow-emerald-950/20"
                        : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                    }`}
            >
                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition ${active
                            ? "bg-white/50 text-slate-950"
                            : "bg-white/[0.07] text-emerald-300 group-hover:bg-emerald-300/15"
                        }`}
                >
                    {item.icon}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                        {item.label}
                    </span>
                    <span
                        className={`mt-0.5 block text-xs ${active ? "text-slate-700/80" : "text-slate-500"
                            }`}
                    >
                        {item.description}
                    </span>
                </span>

                {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/10 text-sm">
                        ✓
                    </span>
                )}
            </NavLink>
        );
    }

    return (
        <>
            {/* Desktop / Tablet Topbar */}
            <nav className="sticky top-0 z-50 hidden border-b border-white/10 bg-[#080d1b]/85 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl md:block">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            aria-label="เปิดเมนู"
                            aria-expanded={isOpen}
                            aria-controls="navDrawer"
                            className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-white/[0.06] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-300/10"
                        >
                            <span className="absolute inset-0 rounded-2xl bg-emerald-300/10 opacity-0 blur-xl transition group-hover:opacity-100" />
                            <img
                                src="/logo.png"
                                alt="โลโก้ BiwBong"
                                className="relative h-9 w-9 object-contain"
                            />
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-base font-extrabold tracking-tight text-white sm:text-lg">
                                    BiwBong
                                </span>
                                <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.15em] text-emerald-300">
                                    PERSONAL
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                                พื้นที่รวมเว็บไซต์และตารางเรียน
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {mainMenu.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === "/"}
                                aria-current={
                                    isActive(item.to) ? "page" : undefined
                                }
                                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${isActive(item.to)
                                        ? "bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-950/20"
                                        : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="hidden lg:inline">
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}

                        {installPrompt && !installed && (
                            <button
                                type="button"
                                onClick={installApp}
                                className="ml-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>↓</span>
                                <span>ติดตั้งแอป</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            aria-label="เปิดเมนูทั้งหมด"
                            aria-expanded={isOpen}
                            aria-controls="navDrawer"
                            className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-lg text-slate-300 transition hover:border-emerald-300/30 hover:bg-white/[0.07] hover:text-emerald-300"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop */}
            <button
                type="button"
                onClick={closeDrawer}
                aria-label="ปิดเมนู"
                tabIndex={isOpen ? 0 : -1}
                className={`fixed inset-0 z-[60] cursor-default bg-slate-950/65 backdrop-blur-sm transition-all duration-300 ${isOpen
                        ? "visible opacity-100"
                        : "invisible pointer-events-none opacity-0"
                    }`}
            />

            {/* Navigation Drawer */}
            <aside
                id="navDrawer"
                aria-label="เมนูหลัก"
                aria-hidden={!isOpen}
                className={`fixed left-0 top-0 z-[70] flex h-dvh w-[320px] max-w-[88vw] flex-col overflow-hidden border-r border-white/10 bg-[#0b1020] text-white shadow-[20px_0_80px_rgba(0,0,0,0.35)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-500/15 blur-[80px]" />

                <div className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="โลโก้ BiwBong"
                            className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.06] object-contain p-1"
                        />
                        <div>
                            <p className="font-extrabold tracking-wide text-white">
                                เมนูนำทาง
                            </p>
                            <p className="mt-0.5 text-[10px] tracking-[0.18em] text-emerald-300">
                                BIWBONG SPACE
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closeDrawer}
                        aria-label="ปิดเมนู"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-lg text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300"
                    >
                        ×
                    </button>
                </div>

                {installPrompt && !installed && (
                    <div className="relative shrink-0 px-4 pt-4">
                        {renderInstallButton()}
                    </div>
                )}

                <div className="relative flex-1 overflow-y-auto p-4">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <span className="text-[10px] font-extrabold tracking-[0.2em] text-slate-500">
                            MAIN MENU
                        </span>
                        <span className="ml-3 h-px flex-1 bg-white/10" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {mainMenu.map(renderMenuItem)}
                    </div>

                    <div className="mb-3 mt-7 flex items-center justify-between px-1">
                        <span className="text-[10px] font-extrabold tracking-[0.2em] text-slate-500">
                            CLASS SCHEDULES
                        </span>
                        <span className="ml-3 h-px flex-1 bg-white/10" />
                    </div>

                    <div className="space-y-1.5">
                        {timetableMenu.map((item, index) => {
                            const active = location.pathname === item.to;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={closeDrawer}
                                    aria-current={
                                        active ? "page" : undefined
                                    }
                                    className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${active
                                            ? "border-emerald-300/20 bg-emerald-300/10 font-bold text-emerald-200"
                                            : "border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                        }`}
                                >
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${active
                                                ? "bg-emerald-300 text-slate-950"
                                                : "bg-white/[0.06] text-slate-500 group-hover:text-emerald-300"
                                            }`}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <span className="flex-1">
                                        {item.label}
                                    </span>

                                    {active && (
                                        <span className="text-emerald-300">
                                            ●
                                        </span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                <div className="relative shrink-0 border-t border-white/10 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                        <span className="text-xs text-slate-400">
                            เว็บไซต์พร้อมใช้งาน
                        </span>
                        <span className="ml-auto text-[10px] font-bold tracking-wider text-slate-600">
                            2026
                        </span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation: แสดงเฉพาะ 2 เมนู ไม่มี Topbar */}
            <nav
                aria-label="เมนูมือถือ"
                className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200/80 bg-white/95 px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-5px_24px_rgba(15,23,42,0.10)] backdrop-blur-xl md:hidden"
            >
                <div className="mx-auto flex h-[54px] max-w-xs items-center justify-center gap-2">
                    {mainMenu.slice(0, 2).map((item) => {
                        const active = isActive(item.to);

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === "/"}
                                aria-current={
                                    active ? "page" : undefined
                                }
                                className={`group relative flex h-[50px] flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl transition-all duration-200 active:scale-95 ${active
                                        ? "bg-gradient-to-b from-emerald-100 to-teal-50 text-emerald-800"
                                        : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                {active && (
                                    <span className="absolute top-0 h-[3px] w-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                                )}

                                <span
                                    className={`text-lg leading-5 transition-transform duration-200 ${active
                                            ? "scale-105"
                                            : "group-hover:scale-110"
                                        }`}
                                >
                                    {item.to === "/" ? "⌂" : "▦"}
                                </span>

                                <span className="text-[10px] font-bold leading-3">
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}