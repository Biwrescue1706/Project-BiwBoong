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
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    // รับชื่อผู้ใช้จากหน้า ForgotPassword.jsx
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
                confirmButtonColor: '#059669',
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
                confirmButtonColor: '#059669',
            });
            return;
        }

        if (password !== confirmPassword) {
            await Swal.fire({
                icon: 'warning',
                title: 'รหัสผ่านไม่ตรงกัน',
                text: 'กรุณากรอกรหัสผ่านทั้งสองช่องให้ตรงกัน',
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
                confirmButtonColor: '#059669',
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
                confirmButtonColor: '#059669',
            });
        } finally {
            setLoading(false);
        }

    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f0fdf9] px-4 py-8">
            <div className="w-full max-w-md">
                <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">
                    {/* Header */}
                    <header className="bg-[#12352f] px-6 py-8 text-center text-white">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-2 shadow-lg">
                            <img
                                src="/logo.png"
                                alt="โลโก้ระบบจัดการอุปกรณ์"
                                className="h-full w-full rounded-xl object-contain"
                            />
                        </div>

                        <h1 className="text-2xl font-bold">
                            ระบบจัดการอุปกรณ์
                        </h1>

                        <p className="mt-2 text-sm text-emerald-100/80">
                            ตั้งรหัสผ่านใหม่
                        </p>
                    </header>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 px-6 py-7 sm:px-8"
                    >
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <KeyRound size={22} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-800">
                                สร้างรหัสผ่านใหม่
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                กำหนดรหัสผ่านใหม่สำหรับบัญชีของคุณ
                            </p>
                        </div>

                        {/* New password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                รหัสผ่านใหม่
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                <CheckCircle2 size={14} />
                                ใช้รหัสผ่านอย่างน้อย 8 ตัวอักษร
                            </p>
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                ยืนยันรหัสผ่านใหม่
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((value) => !value)
                                    }
                                    aria-label={
                                        showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'
                                    }
                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {confirmPassword && (
                                <p
                                    className={`mt-2 text-xs ${password === confirmPassword
                                            ? 'text-emerald-600'
                                            : 'text-red-500'
                                        }`}
                                >
                                    {password === confirmPassword
                                        ? 'รหัสผ่านตรงกัน'
                                        : 'รหัสผ่านยังไม่ตรงกัน'}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin" />
                                    กำลังเปลี่ยนรหัสผ่าน...
                                </>
                            ) : (
                                <>
                                    <KeyRound size={18} />
                                    รีเซ็ตรหัสผ่าน
                                </>
                            )}
                        </button>

                        <div className="border-t border-slate-100 pt-5 text-center">
                            <Link
                                to="/forgot-password"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
                            >
                                <ArrowLeft size={15} />
                                กลับไปหน้าลืมรหัสผ่าน
                            </Link>
                        </div>
                    </form>
                </section>

            </div>
        </main>

    );
}