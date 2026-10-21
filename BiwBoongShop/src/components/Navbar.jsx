
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchUserProfile, logout } from '../services/auth.js';

const menuItems = [
    {
        label: 'จัดการอุปกรณ์',
        shortLabel: 'อุปกรณ์',
        path: '/dashboard',
        icon: '▦',
    },
    {
        label: 'ยืมอุปกรณ์',
        shortLabel: 'ยืม',
        path: '/borrow',
        icon: '↗',
    },
    {
        label: 'ผู้ใช้งาน',
        shortLabel: 'ผู้ใช้',
        path: '/profile',
        icon: '♙',
    },
    {
        label: 'ประวัติการยืม',
        shortLabel: 'ประวัติยืม',
        path: '/borrow-history',
        icon: '◷',
    }
];

function getDisplayName(user) {
    return (
        user?.name ??
        user?.Name ??
        user?.username ??
        user?.Username ??
        'ผู้ใช้งาน'
    );
}

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        let active = true;

        async function verifyLogin() {
            try {
                const profile = await fetchUserProfile();

                if (active) {
                    setUser(profile);
                }
            } catch {
                if (active) {
                    navigate('/', { replace: true });
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        verifyLogin();

        return () => {
            active = false;
        };
    }, [navigate]);

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!drawerOpen) return;

        function closeOnEscape(event) {
            if (event.key === 'Escape') {
                setDrawerOpen(false);
            }
        }

        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [drawerOpen]);

    async function handleLogout() {
        if (loggingOut) return;

        const result = await Swal.fire({
            icon: 'question',
            title: 'ออกจากระบบ?',
            text: 'คุณต้องการออกจากระบบใช่หรือไม่',
            showCancelButton: true,
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#dc2626',
        });

        if (!result.isConfirmed) return;

        setLoggingOut(true);

        try {
            await logout();
            setUser(null);

            await Swal.fire({
                icon: 'success',
                title: 'ออกจากระบบสำเร็จ',
                timer: 1000,
                showConfirmButton: false,
            });

            navigate('/', { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ออกจากระบบไม่สำเร็จ',
                text: error.message || 'กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
            });
        } finally {
            setLoggingOut(false);
        }
    }

    function goTo(path) {
        setDrawerOpen(false);
        navigate(path);
    }

    const displayName = getDisplayName(user);

    if (loading || !user) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                    <p className="text-sm text-slate-500">
                        กำลังตรวจสอบผู้ใช้งาน...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Navbar ด้านบน: แสดงเฉพาะแท็บเล็ตและคอมพิวเตอร์ */}
            <header className="fixed inset-x-0 top-0 z-50 hidden h-16 border-b border-white/10 bg-[#12352f] text-white shadow-lg md:block">
                <div className="flex h-full items-center px-3 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="เปิดเมนูทั้งหมด"
                        aria-controls="navDrawer"
                        aria-expanded={drawerOpen}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 p-1 transition hover:bg-white/20"
                    >
                        <img
                            src="/logo.png"
                            alt="โลโก้ระบบ"
                            className="h-9 w-9 rounded-lg bg-white object-contain"
                        />
                    </button>

                    <div className="ml-3 min-w-0">
                        <h1 className="truncate text-base font-semibold sm:text-lg">
                            ระบบยืม-คืนอุปกรณ์
                        </h1>
                        <p className="hidden text-xs text-emerald-100/60 sm:block">
                            Equipment Management System
                        </p>
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-3">
                        <div className="hidden items-center gap-3 sm:flex">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-semibold text-[#12352f]">
                                {displayName.charAt(0)}
                            </div>

                            <div className="max-w-44">
                                <p className="truncate text-sm font-medium">
                                    {displayName}
                                </p>
                                <p className="text-xs text-emerald-100/60">
                                    ผู้ใช้งานระบบ
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-medium transition hover:bg-red-600 disabled:opacity-60"
                        >
                            <span aria-hidden="true">↪</span>
                            <span>
                                {loggingOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Bottom Navigation: มือถือและหน้าจอเล็กกว่า 768px */}
            <nav
                aria-label="เมนูหลักสำหรับมือถือ"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
            >
                <div className="grid h-16 grid-cols-6">
                    {menuItems.map((item) => {
                        const active =
                            location.pathname === item.path ||
                            location.pathname.startsWith(`${item.path}/`);

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => goTo(item.path)}
                                aria-current={active ? 'page' : undefined}
                                className={`flex min-w-0 flex-col items-center justify-center gap-1 transition ${active
                                    ? 'text-emerald-700'
                                    : 'text-slate-500 hover:text-emerald-700'
                                    }`}
                            >
                                <span
                                    className={`flex h-7 w-9 items-center justify-center rounded-xl text-lg ${active ? 'bg-emerald-50' : ''
                                        }`}
                                >
                                    {item.icon}
                                </span>

                                <span
                                    className={`max-w-full truncate px-0.5 text-[9px] ${active ? 'font-bold' : 'font-medium'
                                        }`}
                                >
                                    {item.shortLabel}
                                </span>
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex min-w-0 flex-col items-center justify-center gap-1 text-slate-500 transition hover:text-red-600 disabled:opacity-50"
                    >
                        <span className="flex h-7 w-9 items-center justify-center text-lg">
                            ↪
                        </span>

                        <span className="max-w-full truncate px-0.5 text-[9px] font-medium">
                            {loggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}
                        </span>
                    </button>
                </div>
            </nav>

            {/* พื้นหลัง Drawer */}
            {drawerOpen && (
                <button
                    type="button"
                    aria-label="ปิดเมนู"
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm"
                />
            )}

            {/* Drawer ด้านข้าง */}
            <aside
                id="navDrawer"
                aria-hidden={!drawerOpen}
                className={`fixed inset-y-0 left-0 z-[70] flex w-[290px] max-w-[85vw] flex-col bg-[#12352f] text-white shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1">
                            <img
                                src="/logo.png"
                                alt="โลโก้ระบบ"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <p className="font-semibold">เมนูหลัก</p>
                            <p className="text-xs text-emerald-100/60">
                                ระบบยืม-คืนอุปกรณ์
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setDrawerOpen(false)}
                        aria-label="ปิดเมนู"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xl transition hover:bg-red-500"
                    >
                        ×
                    </button>
                </div>

                <div className="border-b border-white/10 bg-white/[0.04] px-4 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-semibold text-[#12352f]">
                            {displayName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-semibold">{displayName}</p>
                            <p className="mt-1 text-xs text-emerald-100/60">
                                ผู้ใช้งานระบบ
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-3">
                    <p className="mb-3 px-3 text-xs font-medium tracking-wider text-emerald-200/50">
                        เมนูการใช้งาน
                    </p>

                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const active =
                                location.pathname === item.path ||
                                location.pathname.startsWith(`${item.path}/`);

                            return (
                                <button
                                    key={item.path}
                                    type="button"
                                    onClick={() => goTo(item.path)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium transition ${active
                                        ? 'bg-emerald-400 text-[#12352f] shadow-sm'
                                        : 'text-emerald-50 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                                        {item.icon}
                                    </span>

                                    <span>{item.label}</span>

                                    {active && (
                                        <span className="ml-auto" aria-hidden="true">
                                            ›
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="shrink-0 border-t border-white/10 p-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-emerald-50 transition hover:bg-red-500 disabled:opacity-60"
                    >
                        ↪ ออกจากระบบ
                    </button>
                </div>
            </aside>
        </>
    );
}
