import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const mainMenu = [
    {
        to: "/",
        label: "หน้าหลัก",
        icon: "⌂",
        description: "หน้าแรกของเว็บไซต์",
    },
    {
        to: "/timetable",
        label: "ตารางเรียน",
        icon: "▦",
        description: "ดูตารางเรียนทั้งหมด",
    },
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

    // ตรวจสอบความพร้อมในการติดตั้ง PWA
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

            window.removeEventListener(
                "appinstalled",
                handleAppInstalled
            );
        };
    }, []);

    // ปิดเมนูด้วย Escape และล็อกการเลื่อนหน้าจอขณะเปิดเมนู
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

    // ปิดเมนูเมื่อเปลี่ยนหน้า
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

    // ติดตั้งแอป PWA
    async function installApp() {
        if (!installPrompt) return;

        try {
            await installPrompt.prompt();

            const result = await installPrompt.userChoice;

            if (result.outcome === "accepted") {
                setInstalled(true);
            }
        } catch (error) {
            console.error("PWA installation failed:", error);
        } finally {
            setInstallPrompt(null);
        }
    }

    // ปุ่มติดตั้งแอปในเมนูด้านข้าง
    function renderInstallButton() {
        return (
            <button
                type="button"
                onClick={installApp}
                className="group flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-[#DDF7E5] to-[#F2FBEA] p-3 text-left transition hover:border-emerald-300 hover:shadow-md"
            >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xl text-white shadow-sm">
                    ↓
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-stone-800">
                        ติดตั้งแอป
                    </span>

                    <span className="mt-0.5 block text-xs text-stone-500">
                        เพิ่มไว้บนอุปกรณ์ของคุณ
                    </span>
                </span>

                <span className="text-lg text-emerald-700">↗</span>
            </button>
        );
    }

    // รายการเมนูหลักใน Drawer
    function renderMenuItem(item) {
        const active = isActive(item.to);

        return (
            <NavLink
                key={item.to}
                to={item.to}
                onClick={closeDrawer}
                end={item.to === "/"}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200 ${active
                        ? "border-emerald-200 bg-gradient-to-r from-[#DDF7E5] to-[#EAF9EC] text-emerald-900 shadow-sm"
                        : "border-transparent text-stone-600 hover:border-emerald-100 hover:bg-[#F2FBEA] hover:text-emerald-900"
                    }`}
            >
                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition ${active
                            ? "bg-white text-emerald-800 shadow-sm"
                            : "bg-[#F2FBEA] text-emerald-700 group-hover:bg-[#DDF7E5]"
                        }`}
                >
                    {item.icon}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                        {item.label}
                    </span>

                    <span
                        className={`mt-0.5 block text-xs ${active
                                ? "text-emerald-800/75"
                                : "text-stone-500"
                            }`}
                    >
                        {item.description}
                    </span>
                </span>

                {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700/10 text-sm text-emerald-800">
                        ✓
                    </span>
                )}
            </NavLink>
        );
    }

    return (
        <>
            {/* Desktop / Tablet Topbar */}
            <nav className="sticky top-0 z-50 hidden border-b border-emerald-100 bg-[#FFF8E7]/95 shadow-[0_4px_20px_rgba(70,80,40,0.06)] backdrop-blur-xl md:block">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    {/* Logo และชื่อเว็บไซต์ */}
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            aria-label="เปิดเมนู"
                            aria-expanded={isOpen}
                            aria-controls="navDrawer"
                            className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-[#EAF9EC]"
                        >
                            <img
                                src="/logo.png"
                                alt="โลโก้ BiwBong"
                                className="h-9 w-9 object-contain"
                            />
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-base font-extrabold tracking-tight text-stone-800 sm:text-lg">
                                    BiwBong
                                </span>

                                <span className="rounded-md border border-emerald-200 bg-[#DDF7E5] px-1.5 py-0.5 text-[9px] font-bold tracking-[0.15em] text-emerald-800">
                                    PERSONAL
                                </span>
                            </div>

                            <p className="mt-0.5 truncate text-xs text-stone-500">
                                พื้นที่รวมเว็บไซต์และตารางเรียน
                            </p>
                        </div>
                    </div>

                    {/* เมนูด้านบน */}
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
                                        ? "bg-emerald-700 text-white shadow-sm shadow-emerald-900/10"
                                        : "text-stone-600 hover:bg-[#DDF7E5] hover:text-emerald-900"
                                    }`}
                            >
                                <span className="text-base">
                                    {item.icon}
                                </span>

                                <span className="hidden lg:inline">
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}

                        {installPrompt && !installed && (
                            <button
                                type="button"
                                onClick={installApp}
                                className="ml-1 flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 active:translate-y-0"
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
                            className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-lg text-stone-600 transition hover:border-emerald-300 hover:bg-[#EAF9EC] hover:text-emerald-800"
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
                className={`fixed inset-0 z-[60] cursor-default bg-stone-900/30 backdrop-blur-sm transition-all duration-300 ${isOpen
                        ? "visible opacity-100"
                        : "invisible pointer-events-none opacity-0"
                    }`}
            />

            {/* Navigation Drawer */}
            <aside
                id="navDrawer"
                aria-label="เมนูหลัก"
                aria-hidden={!isOpen}
                className={`fixed left-0 top-0 z-[70] flex h-dvh w-[320px] max-w-[88vw] flex-col overflow-hidden border-r border-emerald-100 bg-[#FFF8E7] text-stone-800 shadow-[20px_0_80px_rgba(70,80,40,0.15)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Decorative Background */}
                <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-emerald-200/50 blur-[80px]" />

                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lime-200/40 blur-[80px]" />

                {/* Drawer Header */}
                <div className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-emerald-100 px-5">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="โลโก้ BiwBong"
                            className="h-10 w-10 rounded-xl border border-emerald-100 bg-white object-contain p-1"
                        />

                        <div>
                            <p className="font-extrabold tracking-wide text-stone-800">
                                เมนูนำทาง
                            </p>

                            <p className="mt-0.5 text-[10px] tracking-[0.18em] text-emerald-700">
                                BIWBONG SPACE
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closeDrawer}
                        aria-label="ปิดเมนู"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-white text-lg text-stone-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                        ×
                    </button>
                </div>

                {/* Install App */}
                {installPrompt && !installed && (
                    <div className="relative shrink-0 px-4 pt-4">
                        {renderInstallButton()}
                    </div>
                )}

                {/* Drawer Menu Content */}
                <div className="relative flex-1 overflow-y-auto p-4">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <span className="text-[10px] font-extrabold tracking-[0.2em] text-stone-400">
                            MAIN MENU
                        </span>

                        <span className="ml-3 h-px flex-1 bg-emerald-100" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {mainMenu.map(renderMenuItem)}
                    </div>

                    <div className="mb-3 mt-7 flex items-center justify-between px-1">
                        <span className="text-[10px] font-extrabold tracking-[0.2em] text-stone-400">
                            CLASS SCHEDULES
                        </span>

                        <span className="ml-3 h-px flex-1 bg-emerald-100" />
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
                                            ? "border-emerald-200 bg-[#DDF7E5] font-bold text-emerald-900"
                                            : "border-transparent text-stone-600 hover:border-emerald-100 hover:bg-[#F2FBEA] hover:text-emerald-900"
                                        }`}
                                >
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${active
                                                ? "bg-emerald-700 text-white"
                                                : "bg-white text-stone-500 group-hover:bg-[#DDF7E5] group-hover:text-emerald-800"
                                            }`}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <span className="flex-1">
                                        {item.label}
                                    </span>

                                    {active && (
                                        <span className="text-emerald-700">
                                            ●
                                        </span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/* Drawer Status */}
                <div className="relative shrink-0 border-t border-emerald-100 bg-white/50 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        <span className="text-xs text-stone-500">
                            เว็บไซต์พร้อมใช้งาน
                        </span>

                        <span className="ml-auto text-[10px] font-bold tracking-wider text-stone-400">
                            2026
                        </span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation: ไม่มี Topbar */}
            <nav
                aria-label="เมนูมือถือ"
                className="fixed bottom-0 left-0 right-0 z-[100] border-t border-emerald-100 bg-[#FFF8E7]/95 px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-5px_24px_rgba(70,80,40,0.08)] backdrop-blur-xl md:hidden"
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
                                        ? "bg-gradient-to-b from-[#DDF7E5] to-[#EAF9EC] text-emerald-900"
                                        : "text-stone-500 hover:bg-white"
                                    }`}
                            >
                                {active && (
                                    <span className="absolute top-0 h-[3px] w-5 rounded-full bg-emerald-600" />
                                )}

                                <span
                                    className={`text-lg leading-5 transition-transform duration-200 ${active
                                            ? "scale-105"
                                            : "group-hover:scale-110"
                                        }`}
                                >
                                    {item.icon}
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