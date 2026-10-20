
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login, fetchUserProfile } from '../services/auth';

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
        <main className="login-background flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
            <section className="login-card w-full max-w-md overflow-hidden rounded-3xl border border-white bg-white shadow-xl shadow-emerald-950/5 sm:rounded-[28px] md:max-w-5xl md:shadow-2xl md:shadow-emerald-950/10">

                {/* Mobile Header */}
                <div className="brand-panel relative overflow-hidden px-6 py-8 text-center text-white md:hidden">
                    <div className="brand-pattern absolute inset-0 opacity-50" />

                    <div className="relative z-10">
                        <div className="mx-auto mb-4 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-white/30 bg-white p-2 shadow-lg">
                            <img
                                src="/logo.png"
                                alt="ตราสัญลักษณ์ระบบ"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            ระบบจัดการอุปกรณ์
                        </h1>

                        <p className="mt-2 text-sm font-light text-emerald-50">
                            Equipment Management System
                        </p>
                    </div>
                </div>

                <div className="md:grid md:grid-cols-2">

                    {/* Brand Panel */}
                    <aside className="brand-panel relative hidden min-h-[600px] flex-col justify-between overflow-hidden p-8 text-white md:flex md:p-9 lg:p-12">
                        <div className="brand-pattern absolute inset-0 opacity-50" />

                        <div className="relative z-10">
                            <div className="mb-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-white/30 bg-white p-2 shadow-lg">
                                <img
                                    src="/logo.png"
                                    alt="ตราสัญลักษณ์ระบบ"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-light text-emerald-50">
                                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                ระบบบริหารจัดการภายใน
                            </p>

                            <h2 className="text-3xl font-semibold leading-relaxed lg:text-4xl">
                                จัดการอุปกรณ์
                                <br />
                                ได้อย่างเป็นระบบ
                            </h2>

                            <p className="mt-5 max-w-sm text-sm font-light leading-7 text-emerald-50/90 lg:text-base">
                                ระบบสำหรับบริหารจัดการข้อมูลอุปกรณ์
                                ช่วยให้การเข้าถึงข้อมูลและการดำเนินงานสะดวก
                                รวดเร็ว และมีประสิทธิภาพยิ่งขึ้น
                            </p>

                            <div className="mt-9 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                                        ✓
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">
                                            จัดการข้อมูลอย่างเป็นระบบ
                                        </p>
                                        <p className="mt-0.5 text-xs font-light text-emerald-100/80">
                                            เข้าถึงข้อมูลได้สะดวก
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                                        ◈
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">
                                            ใช้งานง่ายทุกอุปกรณ์
                                        </p>
                                        <p className="mt-0.5 text-xs font-light text-emerald-100/80">
                                            รองรับแท็บเล็ตและคอมพิวเตอร์
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-10 border-t border-white/20 pt-5 text-xs font-light leading-6 text-emerald-100/80">
                            Equipment Management System
                            <br />
                            ระบบบริหารจัดการเพื่อการทำงานที่มีประสิทธิภาพ
                        </div>

                        <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute -bottom-16 -right-8 h-44 w-44 rounded-full border border-white/10" />
                    </aside>

                    {/* Login Form */}
                    <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 md:px-8 md:py-12 lg:px-12">

                        <div className="mb-8 hidden md:block">
                            <p className="mb-2 text-sm font-medium tracking-wide text-emerald-700">
                                WELCOME BACK
                            </p>

                            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                                เข้าสู่ระบบ
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                กรุณากรอกชื่อผู้ใช้และรหัสผ่านเพื่อดำเนินการต่อ
                            </p>
                        </div>

                        <div className="mb-7 md:hidden">
                            <h2 className="text-2xl font-semibold text-slate-900">
                                ยินดีต้อนรับ
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                เข้าสู่ระบบเพื่อเริ่มใช้งาน
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    ชื่อผู้ใช้
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
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
                                        className="input-field w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    รหัสผ่าน
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
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
                                        className="input-field w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-14 text-sm text-slate-800 placeholder:text-slate-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-xl px-4 text-slate-400 transition hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
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

                            {/* Forgot Password */}
                            <div className="flex justify-end pt-0.5">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900 hover:underline"
                                >
                                    ลืมรหัสผ่าน?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="login-button flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-medium text-white shadow-lg shadow-emerald-700/10 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}

                                {!loading && (
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
                                    >
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                            <p className="text-xs leading-6 text-slate-400">
                                ระบบจัดการอุปกรณ์
                                <span className="mx-1 text-slate-300">•</span>
                                สำหรับผู้ใช้งานที่ได้รับอนุญาต
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
