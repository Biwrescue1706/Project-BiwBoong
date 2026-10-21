import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    KeyRound,
    UserRound,
    Search,
    ArrowLeft,
    LoaderCircle,
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
        <main className="flex min-h-screen items-center justify-center bg-[#f0fdf9] px-4 py-8">
            <div className="w-full max-w-md">
                <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">
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
                            กู้คืนบัญชีผู้ใช้งาน
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="px-6 py-7 sm:px-8">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <KeyRound size={22} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-800">
                                ลืมรหัสผ่าน
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                กรอกชื่อผู้ใช้ของคุณเพื่อดำเนินการตรวจสอบ
                            </p>
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                ชื่อผู้ใช้
                            </label>

                            <div className="relative">
                                <UserRound
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder="กรอกชื่อผู้ใช้"
                                    required
                                    autoComplete="username"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin" />
                                    กำลังตรวจสอบ...
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    ตรวจสอบ
                                </>
                            )}
                        </button>

                        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
                            >
                                <ArrowLeft size={15} />
                                กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>
                    </form>
                </section>

                <p className="mt-5 text-center text-xs text-slate-400">
                    © 2569 เว็บระบบยืม-คืนอุปกรณ์ BiwBong
                </p>
            </div>
        </main>

    );
}