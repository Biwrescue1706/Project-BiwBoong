import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    KeyRound,
    UserRound,
    Search,
    ArrowLeft,
    LoaderCircle,
    ShieldCheck,
    LockKeyhole,
    CircleHelp,
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const account = username.trim();

        if (!account) {
            await Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกชื่อผู้ใช้',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
            return;
        }

        if (!API_BASE_URL) {
            await Swal.fire({
                icon: 'error',
                title: 'ไม่พบการตั้งค่า API',
                text: 'กรุณาตรวจสอบ VITE_API_URL ในไฟล์ .env',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/forgot-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username: account }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || 'ไม่สามารถตรวจสอบชื่อผู้ใช้ได้'
                );
            }

            const result = await Swal.fire({
                icon: 'success',
                title: 'ตรวจสอบเรียบร้อย',
                text: data.message || 'สามารถดำเนินการตั้งรหัสผ่านใหม่ได้',
                confirmButtonText: 'ตั้งรหัสผ่านใหม่',
                confirmButtonColor: '#059669',
                allowOutsideClick: false,
            });

            if (result.isConfirmed) {
                navigate('/reset-password', {
                    state: { username: account },
                });
            }
        } catch (error) {
            console.error('Forgot password error:', error);

            await Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถดำเนินการได้',
                text: error.message || 'กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6f2] px-4 py-8 sm:px-6">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#dcefe3] opacity-80 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-[450px] w-[450px] rounded-full bg-[#f8e9c9] opacity-70 blur-3xl" />

            <div className="relative z-10 w-full max-w-5xl">
                <section className="grid overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_24px_80px_-28px_rgba(24,65,48,0.22)] md:grid-cols-[0.9fr_1.1fr]">

                    <aside className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-[#174b3d] p-9 text-white md:flex lg:p-12">
                        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border-[35px] border-white/[0.06]" />
                        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#d5a84e]/10 blur-2xl" />
                        <div className="pointer-events-none absolute right-10 top-1/2 h-40 w-40 rounded-full border border-white/10" />

                        <div className="relative z-10">
                            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-white p-2.5 shadow-xl shadow-black/10">
                                <img
                                    src="/logo.png"
                                    alt="โลโก้ระบบจัดการอุปกรณ์"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
                                <ShieldCheck size={14} />
                                ACCOUNT RECOVERY
                            </p>

                            <h2 className="mt-6 text-3xl font-bold leading-[1.45] lg:text-[38px]">
                                กลับมาใช้งาน
                                <br />
                                บัญชีของคุณ
                                <br />
                                <span className="text-[#f2c46e]">ได้อีกครั้ง</span>
                            </h2>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-emerald-50/75">
                                ลืมรหัสผ่านไม่ใช่ปัญหา
                                เพียงตรวจสอบชื่อผู้ใช้ของคุณ
                                แล้วดำเนินการตั้งรหัสผ่านใหม่ตามขั้นตอน
                            </p>

                            <div className="mt-9 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#f2c46e]">
                                        <UserRound size={19} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            ตรวจสอบบัญชีผู้ใช้
                                        </p>
                                        <p className="mt-0.5 text-xs text-emerald-100/60">
                                            ใช้ชื่อผู้ใช้ที่ลงทะเบียนไว้
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#f2c46e]">
                                        <LockKeyhole size={19} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            ตั้งรหัสผ่านใหม่
                                        </p>
                                        <p className="mt-0.5 text-xs text-emerald-100/60">
                                            กลับเข้าสู่ระบบได้อีกครั้ง
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 border-t border-white/15 pt-5">
                            <p className="text-xs leading-6 text-emerald-100/60">
                                Equipment Management System
                                <br />
                                ระบบบริหารจัดการอุปกรณ์
                            </p>
                        </div>
                    </aside>

                    <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
                        <div className="mb-8 flex items-center gap-3 md:hidden">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-md ring-1 ring-slate-100">
                                <img
                                    src="/logo.png"
                                    alt="โลโก้ระบบจัดการอุปกรณ์"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[#174b3d]">
                                    ระบบจัดการอุปกรณ์
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Equipment Management System
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3d9] text-[#b47a20]">
                                <KeyRound size={26} strokeWidth={1.8} />
                            </div>

                            <p className="text-xs font-bold tracking-[0.18em] text-[#b47a20]">
                                FORGOT PASSWORD
                            </p>

                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
                                ลืมรหัสผ่าน?
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                ไม่ต้องกังวล กรอกชื่อผู้ใช้ของคุณ
                                เพื่อเริ่มต้นขั้นตอนการกู้คืนบัญชี
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

                                <div className="relative">
                                    <UserRound
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(event) =>
                                            setUsername(event.target.value)
                                        }
                                        placeholder="กรอกชื่อผู้ใช้ของคุณ"
                                        required
                                        autoComplete="username"
                                        disabled={loading}
                                        className="w-full rounded-2xl border border-slate-200 bg-[#f8faf8] py-4 pl-12 pr-4 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#43866b] focus:bg-white focus:ring-4 focus:ring-[#43866b]/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>

                                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                    <CircleHelp size={13} />
                                    กรุณากรอกชื่อผู้ใช้ที่ใช้เข้าสู่ระบบ
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#1d624d] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#1d624d]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#174b3d] hover:shadow-xl hover:shadow-[#1d624d]/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        กำลังตรวจสอบข้อมูล...
                                    </>
                                ) : (
                                    <>
                                        <Search
                                            size={19}
                                            className="transition-transform group-hover:scale-110"
                                        />
                                        ตรวจสอบชื่อผู้ใช้
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <Link
                                to="/"
                                className="group inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-semibold text-slate-500 transition hover:text-[#1d624d]"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-[#e8f3ec] group-hover:text-[#1d624d]">
                                    <ArrowLeft size={16} />
                                </span>
                                กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>

                        <p className="mt-8 text-center text-[11px] leading-5 text-slate-400">
                            ระบบนี้สำหรับผู้ใช้งานที่ได้รับอนุญาตเท่านั้น
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}