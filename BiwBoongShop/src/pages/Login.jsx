import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    login,
    fetchUserProfile,
} from '../services/auth';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            await login(username.trim(), password);

            const user = await fetchUserProfile();

            await Swal.fire({
                icon: 'success',
                title: `ยินดีต้อนรับ ${user?.name ?? user?.Name ?? user?.username ?? user?.Username ?? ''}`,
                timer: 1000,
                showConfirmButton: false,
            });

            navigate('/dashboard', { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f6f3] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-[480px] w-[480px] rounded-full bg-teal-200/40 blur-3xl" />

            <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_25px_80px_-25px_rgba(15,70,50,0.22)]">

                <div className="grid md:grid-cols-2">

                    <aside className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#087f68] p-9 text-white md:flex lg:p-12">

                        <div className="absolute inset-0 bg-gradient-to-br from-[#087f68] via-[#079477] to-[#24ad88]" />

                        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border-[45px] border-white/[0.07]" />
                        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[35px] border-white/[0.07]" />
                        <div className="pointer-events-none absolute right-12 top-1/2 h-32 w-32 rounded-full bg-white/[0.05]" />

                        <div className="relative z-10">
                            <div className="mb-12 flex h-[82px] w-[82px] items-center justify-center rounded-2xl bg-white p-2.5 shadow-xl shadow-emerald-950/15">
                                <img
                                    src="/logo.png"
                                    alt="ตราสัญลักษณ์ระบบ"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-medium text-emerald-50 backdrop-blur-sm">
                                <span className="h-2 w-2 rounded-full bg-lime-300" />
                                EQUIPMENT MANAGEMENT
                            </div>

                            <h1 className="text-3xl font-bold leading-[1.4] tracking-tight lg:text-[38px]">
                                จัดการอุปกรณ์
                                <br />
                                ให้เป็นเรื่องง่าย
                            </h1>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-emerald-50/90 lg:text-base">
                                ระบบบริหารจัดการข้อมูลอุปกรณ์
                                ที่ช่วยให้การทำงานเป็นระเบียบ
                                ค้นหาข้อมูลได้สะดวก และตรวจสอบได้ในที่เดียว
                            </p>

                            <div className="mt-10 space-y-5">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            ข้อมูลอยู่ในที่เดียว
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-100/75">
                                            จัดเก็บและค้นหาได้สะดวก
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg">
                                        ◈
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            ใช้งานได้ทุกหน้าจอ
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-100/75">
                                            รองรับทั้งคอมพิวเตอร์และแท็บเล็ต
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 border-t border-white/20 pt-5">
                            <p className="text-xs font-medium text-emerald-50">
                                Equipment Management System
                            </p>
                            <p className="mt-1 text-[11px] text-emerald-100/70">
                                ระบบบริหารจัดการเพื่อการทำงานที่มีประสิทธิภาพ
                            </p>
                        </div>
                    </aside>

                    <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">

                        <div className="mb-8 flex items-center gap-3 md:hidden">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                                <img
                                    src="/logo.png"
                                    alt="ตราสัญลักษณ์ระบบ"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div>
                                <p className="text-base font-bold text-slate-800">
                                    ระบบจัดการอุปกรณ์
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Equipment Management System
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-emerald-700">
                                <span className="h-[2px] w-6 rounded-full bg-emerald-500" />
                                WELCOME BACK
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                                เข้าสู่ระบบ
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                ยินดีต้อนรับกลับมา
                                กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    ชื่อผู้ใช้
                                </label>

                                <div className="group relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-emerald-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                        </svg>
                                    </span>

                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="กรอกชื่อผู้ใช้"
                                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    รหัสผ่าน
                                </label>

                                <div className="group relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-emerald-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="กรอกรหัสผ่าน"
                                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3.5 pl-12 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-xl px-4 text-slate-400 transition hover:text-emerald-700 focus:outline-none"
                                        aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                        aria-pressed={showPassword}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7s-1.2 2.4-3.1 3.8" />
                                                <path d="M6.2 6.2C3.5 8.1 2 12 2 12s3.6 7 10 7c1.4 0 2.7-.3 3.8-.8" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-0.5">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 hover:underline"
                                >
                                    ลืมรหัสผ่าน?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#07866d] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-800/15 transition hover:-translate-y-0.5 hover:bg-[#06745f] hover:shadow-xl hover:shadow-emerald-800/20 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        กำลังเข้าสู่ระบบ...
                                    </>
                                ) : (
                                    <>
                                        เข้าสู่ระบบ
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-transform group-hover:translate-x-1"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-9 border-t border-slate-100 pt-5 text-center">
                            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                ระบบพร้อมให้บริการ
                            </div>

                            <p className="text-xs leading-6 text-slate-400">
                                ระบบจัดการอุปกรณ์
                                <span className="mx-1.5 text-slate-300">•</span>
                                สำหรับผู้ใช้งานที่ได้รับอนุญาต
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}