import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    KeyRound,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowLeft,
    LoaderCircle,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
    CircleCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const username = location.state?.username || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username) {
            await Swal.fire({
                icon: 'warning',
                title: 'ไม่พบข้อมูลบัญชี',
                text: 'กรุณากลับไปกรอกชื่อผู้ใช้ในหน้าลืมรหัสผ่านอีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1d624d',
            });

            navigate('/forgot-password', { replace: true });
            return;
        }

        if (!password || password.length < 8) {
            await Swal.fire({
                icon: 'warning',
                title: 'รหัสผ่านไม่ถูกต้อง',
                text: 'กรุณาตั้งรหัสผ่านอย่างน้อย 8 ตัวอักษร',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1d624d',
            });
            return;
        }

        if (password !== confirmPassword) {
            await Swal.fire({
                icon: 'warning',
                title: 'รหัสผ่านไม่ตรงกัน',
                text: 'กรุณากรอกรหัสผ่านทั้งสองช่องให้ตรงกัน',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1d624d',
            });
            return;
        }

        if (!API_BASE_URL) {
            await Swal.fire({
                icon: 'error',
                title: 'ไม่พบการตั้งค่า API',
                text: 'กรุณาตรวจสอบ VITE_API_URL ในไฟล์ .env',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1d624d',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้'
                );
            }

            await Swal.fire({
                icon: 'success',
                title: 'เปลี่ยนรหัสผ่านสำเร็จ',
                text: data.message || 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว',
                confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
                confirmButtonColor: '#1d624d',
                allowOutsideClick: false,
            });

            navigate('/', { replace: true });
        } catch (error) {
            console.error('Reset password error:', error);

            await Swal.fire({
                icon: 'error',
                title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
                text: error.message || 'กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#1d624d',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6f1] px-4 py-8 sm:px-6">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="relative w-full max-w-5xl">
                <section className="grid overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_24px_80px_-30px_rgba(20,60,45,0.25)] lg:grid-cols-[0.9fr_1.1fr]">

                    <aside className="relative hidden overflow-hidden bg-[#174b3d] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[40px] border-white/[0.04]" />
                        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

                        <div className="relative z-10">
                            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-xl shadow-black/10">
                                <img
                                    src="/logo.png"
                                    alt="โลโก้ระบบจัดการอุปกรณ์"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">
                                <Sparkles size={14} className="text-[#f2c46e]" />
                                Equipment Management System
                            </div>

                            <h1 className="text-3xl font-bold leading-tight tracking-tight">
                                ระบบจัดการ
                                <br />
                                อุปกรณ์
                            </h1>

                            <p className="mt-4 max-w-xs text-sm leading-7 text-emerald-100/75">
                                จัดการอุปกรณ์และข้อมูลต่าง ๆ ได้อย่างสะดวก
                                พร้อมระบบรักษาความปลอดภัยสำหรับบัญชีของคุณ
                            </p>
                        </div>

                        <div className="relative z-10 mt-12">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2c46e] text-[#174b3d]">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        ความปลอดภัยของบัญชี
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-100/65">
                                        ตั้งรหัสผ่านใหม่เพื่อปกป้องข้อมูลของคุณ
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-white/15" />

                            <p className="mt-5 text-xs text-emerald-100/50">
                                © {new Date().getFullYear()} Equipment Management System
                            </p>
                        </div>
                    </aside>

                    <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174b3d] p-2 shadow-md">
                                <img
                                    src="/logo.png"
                                    alt="โลโก้ระบบจัดการอุปกรณ์"
                                    className="h-full w-full rounded-xl object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[#174b3d]">
                                    ระบบจัดการอุปกรณ์
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Equipment Management System
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2c46e]/25 text-[#a66c13]">
                                <KeyRound size={27} strokeWidth={2} />
                            </div>

                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b17b25]">
                                Account Security
                            </p>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                สร้างรหัสผ่านใหม่
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                กำหนดรหัสผ่านใหม่สำหรับบัญชีของคุณ
                                เพื่อกลับเข้าใช้งานระบบอีกครั้ง
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    รหัสผ่านใหม่
                                </label>

                                <div className="group relative">
                                    <LockKeyhole
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#1d624d]"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="อย่างน้อย 8 ตัวอักษร"
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf8] py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d624d] focus:bg-white focus:ring-4 focus:ring-[#1d624d]/10 disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#1d624d]"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                    <CheckCircle2 size={15} className="text-[#b17b25]" />
                                    ต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    ยืนยันรหัสผ่านใหม่
                                </label>

                                <div className="group relative">
                                    <LockKeyhole
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#1d624d]"
                                    />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(event.target.value)
                                        }
                                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                                        autoComplete="new-password"
                                        required
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf8] py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1d624d] focus:bg-white focus:ring-4 focus:ring-[#1d624d]/10 disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword((value) => !value)
                                        }
                                        aria-label={
                                            showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'
                                        }
                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#1d624d]"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>

                                {confirmPassword && (
                                    <p
                                        className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                                            password === confirmPassword
                                                ? 'text-emerald-600'
                                                : 'text-red-500'
                                        }`}
                                    >
                                        {password === confirmPassword ? (
                                            <CircleCheck size={14} />
                                        ) : (
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                        )}
                                        {password === confirmPassword
                                            ? 'รหัสผ่านตรงกันแล้ว'
                                            : 'รหัสผ่านยังไม่ตรงกัน'}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d624d] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#174b3d]/15 transition-all hover:-translate-y-0.5 hover:bg-[#174b3d] hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle size={19} className="animate-spin" />
                                        กำลังเปลี่ยนรหัสผ่าน...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={18} />
                                        เปลี่ยนรหัสผ่าน
                                    </>
                                )}
                            </button>

                            <div className="border-t border-slate-100 pt-5">
                                <Link
                                    to="/forgot-password"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#1d624d]"
                                >
                                    <ArrowLeft size={16} />
                                    กลับไปหน้าลืมรหัสผ่าน
                                </Link>
                            </div>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <ShieldCheck size={15} className="text-[#1d624d]" />
                            ข้อมูลบัญชีของคุณได้รับการดูแลอย่างปลอดภัย
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}