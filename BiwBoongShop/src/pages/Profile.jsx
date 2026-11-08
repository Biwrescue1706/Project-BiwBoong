import { useEffect, useMemo, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
    Users,
    UserRound,
    UserPlus,
    Search,
    RefreshCw,
    Pencil,
    Trash2,
    CalendarDays,
    ShieldCheck,
    ArrowUpRight,
    X,
    LockKeyhole,
    User,
    CircleUserRound,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';

import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
} from '../services/Profile.js';

function formatDateThai(value) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[char]);
}

const inputClass = `
    swal2-input !m-0 !mt-1 !h-11 !w-full !max-w-none
    !rounded-xl !border !border-slate-200 !bg-slate-50
    !px-3 !text-sm !text-slate-700 !shadow-none
    placeholder:!text-slate-400
    focus:!border-emerald-400 focus:!bg-white
    focus:!ring-4 focus:!ring-emerald-50
`;

const popupClass = {
    popup: '!w-[calc(100%-24px)] !max-w-[460px] !rounded-3xl !p-5 !shadow-2xl sm:!p-7',
    title: '!mb-1 !text-xl !font-bold !text-slate-800',
    htmlContainer: '!m-0 !overflow-visible !text-left',
    actions: '!mt-6 !w-full !flex-row !gap-2',
    confirmButton: '!m-0 !rounded-xl !bg-emerald-600 !px-5 !py-3 !text-sm !font-semibold !text-white !shadow-none hover:!bg-emerald-700 focus:!ring-4 focus:!ring-emerald-100',
    cancelButton: '!m-0 !rounded-xl !bg-slate-100 !px-5 !py-3 !text-sm !font-semibold !text-slate-600 !shadow-none hover:!bg-slate-200',
};

export default function Profile() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadUsers = useCallback(async () => {
        setLoading(true);

        try {
            const data = await fetchUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ',
                text: error.message || 'กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return users;

        return users.filter(user =>
            String(user.username ?? '').toLowerCase().includes(keyword) ||
            String(user.name ?? '').toLowerCase().includes(keyword)
        );
    }, [users, search]);

    async function handleAddUser() {
        const result = await Swal.fire({
            title: 'เพิ่มสมาชิกใหม่',
            html: `
                <div class="mb-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                    <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="10" cy="7" r="4"/>
                                <line x1="19" y1="8" x2="19" y2="14"/>
                                <line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-emerald-900">สร้างบัญชีสมาชิก</p>
                            <p class="mt-0.5 text-xs text-emerald-700">กรอกข้อมูลเพื่อเพิ่มสมาชิกเข้าสู่ระบบ</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 text-left">
                    <div>
                        <label for="reg-username" class="mb-1.5 block text-xs font-semibold text-slate-600">
                            Username <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="8" r="5"/>
                                    <path d="M20 21a8 8 0 0 0-16 0"/>
                                </svg>
                            </span>
                            <input id="reg-username" class="${inputClass} !pl-10" placeholder="กำหนด Username" autocomplete="off" />
                        </div>
                    </div>

                    <div>
                        <label for="reg-name" class="mb-1.5 block text-xs font-semibold text-slate-600">
                            ชื่อสมาชิก <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </span>
                            <input id="reg-name" class="${inputClass} !pl-10" placeholder="กรอกชื่อจริง" autocomplete="name" />
                        </div>
                    </div>

                    <div>
                        <label for="reg-password" class="mb-1.5 block text-xs font-semibold text-slate-600">
                            รหัสผ่าน <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </span>
                            <input id="reg-password" type="password" class="${inputClass} !pl-10" placeholder="กำหนดรหัสผ่าน" autocomplete="new-password" />
                        </div>
                    </div>

                    <div class="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
                        <span class="mt-0.5 text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                        </span>
                        <p class="text-[11px] leading-relaxed text-amber-800">
                            กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดเพิ่มสมาชิก
                        </p>
                    </div>
                </div>
            `,
            width: '460px',
            padding: '24px',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'เพิ่มสมาชิก',
            cancelButtonText: 'ยกเลิก',
            buttonsStyling: false,
            customClass: popupClass,
            reverseButtons: true,
            didOpen: () => {
                document.getElementById('reg-username')?.focus();
            },
            preConfirm: () => {
                const username = document.getElementById('reg-username')?.value.trim();
                const name = document.getElementById('reg-name')?.value.trim();
                const password = document.getElementById('reg-password')?.value;

                if (!username || !name || !password) {
                    Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบทุกช่อง');
                    return false;
                }

                return { username, name, password };
            },
        });

        if (!result.isConfirmed) return;

        try {
            await createUser(result.value);
            await loadUsers();

            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มสมาชิกสำเร็จ',
                text: 'บันทึกข้อมูลสมาชิกเรียบร้อยแล้ว',
                timer: 1600,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถเพิ่มสมาชิกได้',
                confirmButtonColor: '#059669',
            });
        }
    }

    async function handleEditUser(user) {
        const userId = user.UserId;
        const oldUsername = user.username ?? '';
        const oldName = user.name ?? '';

        const result = await Swal.fire({
            title: 'แก้ไขข้อมูลสมาชิก',
            html: `
                <div class="mb-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 20h9"/>
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-bold text-blue-900">แก้ไขบัญชีสมาชิก</p>
                            <p class="mt-0.5 truncate text-xs text-blue-700">@${escapeHTML(oldUsername)}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 text-left">
                    <div>
                        <label for="edit-username" class="mb-1.5 block text-xs font-semibold text-slate-600">
                            Username <span class="text-red-500">*</span>
                        </label>
                        <input id="edit-username" class="${inputClass}" autocomplete="off" />
                    </div>

                    <div>
                        <label for="edit-name" class="mb-1.5 block text-xs font-semibold text-slate-600">
                            ชื่อสมาชิก <span class="text-red-500">*</span>
                        </label>
                        <input id="edit-name" class="${inputClass}" autocomplete="name" />
                    </div>

                    <div class="border-t border-slate-100 pt-4">
                        <label for="edit-password" class="mb-1.5 block text-xs font-semibold text-slate-600">
                            รหัสผ่านใหม่
                        </label>
                        <input id="edit-password" type="password" class="${inputClass}" placeholder="เว้นว่างหากไม่ต้องการเปลี่ยน" autocomplete="new-password" />
                        <p class="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                            หากไม่เปลี่ยนรหัสผ่าน สามารถเว้นช่องนี้ไว้ได้
                        </p>
                    </div>

                    <div class="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
                        <p class="text-[11px] leading-relaxed text-blue-700">
                            ข้อมูลเดิมจะแสดงในช่องกรอก สามารถแก้ไขเฉพาะส่วนที่ต้องการได้
                        </p>
                    </div>
                </div>
            `,
            width: '460px',
            padding: '24px',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'บันทึกการแก้ไข',
            cancelButtonText: 'ยกเลิก',
            buttonsStyling: false,
            customClass: {
                ...popupClass,
                confirmButton: '!m-0 !rounded-xl !bg-blue-600 !px-5 !py-3 !text-sm !font-semibold !text-white !shadow-none hover:!bg-blue-700 focus:!ring-4 focus:!ring-blue-100',
            },
            reverseButtons: true,
            didOpen: () => {
                document.getElementById('edit-username').value = oldUsername;
                document.getElementById('edit-name').value = oldName;
                document.getElementById('edit-username')?.focus();
            },
            preConfirm: () => {
                const username = document.getElementById('edit-username')?.value.trim();
                const name = document.getElementById('edit-name')?.value.trim();
                const password = document.getElementById('edit-password')?.value;

                if (!username || !name) {
                    Swal.showValidationMessage('กรุณากรอก Username และชื่อให้ครบ');
                    return false;
                }

                const updateData = {};

                if (username !== oldUsername) {
                    updateData.username = username;
                }

                if (name !== oldName) {
                    updateData.name = name;
                }

                if (password) {
                    updateData.password = password;
                }

                if (Object.keys(updateData).length === 0) {
                    Swal.showValidationMessage('คุณยังไม่ได้เปลี่ยนข้อมูลใด ๆ');
                    return false;
                }

                return updateData;
            },
        });

        if (!result.isConfirmed) return;

        try {
            await updateUser(userId, result.value);
            await loadUsers();

            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลสำเร็จ',
                text: 'ข้อมูลสมาชิกถูกอัปเดตเรียบร้อยแล้ว',
                timer: 1600,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถแก้ไขข้อมูลได้',
                confirmButtonColor: '#059669',
            });
        }
    }

    async function handleDeleteUser(user) {
        const result = await Swal.fire({
            title: 'ยืนยันการลบสมาชิก?',
            html: `
                <div class="py-2">
                    <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M8 6V4h8v2"/>
                            <path d="m19 6-1 14H6L5 6"/>
                            <path d="M10 11v5m4-5v5"/>
                        </svg>
                    </div>
                    <p class="mb-3 text-sm text-slate-500">
                        คุณต้องการลบสมาชิกคนนี้ใช่หรือไม่
                    </p>
                    <div class="rounded-xl border border-red-100 bg-red-50 p-4">
                        <strong class="text-base font-bold text-red-700">
                            ${escapeHTML(user.name ?? '-')}
                        </strong>
                        <p class="mt-1 text-xs text-red-400">
                            @${escapeHTML(user.username ?? '-')}
                        </p>
                    </div>
                    <p class="mt-3 text-xs text-slate-400">
                        เมื่อลบแล้วจะไม่สามารถย้อนกลับได้
                    </p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'ยืนยันลบสมาชิก',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#dc5252',
            cancelButtonColor: '#64748b',
            reverseButtons: true,
            focusCancel: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUser(user.UserId);
            await loadUsers();

            await Swal.fire({
                icon: 'success',
                title: 'ลบสมาชิกสำเร็จ',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถลบสมาชิกได้',
                confirmButtonColor: '#059669',
            });
        }
    }

    const stats = [
        {
            title: 'สมาชิกทั้งหมด',
            value: users.length,
            unit: 'คน',
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
            accent: 'bg-blue-500',
            description: 'สมาชิกในระบบทั้งหมด',
        },
        {
            title: 'บัญชีผู้ใช้งาน',
            value: users.length,
            unit: 'บัญชี',
            icon: UserRound,
            color: 'bg-violet-50 text-violet-600',
            accent: 'bg-violet-500',
            description: 'บัญชีที่ลงทะเบียนไว้',
        },
        {
            title: 'สถานะระบบ',
            value: 'ปกติ',
            unit: '',
            icon: ShieldCheck,
            color: 'bg-emerald-50 text-emerald-600',
            accent: 'bg-emerald-500',
            description: 'ระบบจัดการสมาชิก',
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7f6]">
            <Navbar />

            <main className="mx-auto max-w-[1450px] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 md:pb-12 md:pt-24 lg:px-8">
                <section className="mb-5 flex flex-col justify-between gap-4 lg:mb-7 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            MEMBER MANAGEMENT
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            จัดการสมาชิก
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
                            จัดการข้อมูลบัญชีผู้ใช้งานและตรวจสอบรายชื่อสมาชิก
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={loadUsers}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                        >
                            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                            รีเฟรช
                        </button>

                        <button
                            type="button"
                            onClick={handleAddUser}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            <UserPlus size={18} />
                            เพิ่มสมาชิก
                        </button>
                    </div>
                </section>

                <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#087f68] via-[#109879] to-[#22a887] px-5 py-5 text-white shadow-lg shadow-emerald-900/10 sm:mb-7 sm:px-8 sm:py-7">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-emerald-100 sm:text-sm">
                                MEMBER INFORMATION
                            </p>

                            <h2 className="mt-1.5 text-xl font-bold sm:mt-2 sm:text-3xl">
                                ดูแลสมาชิกได้ในที่เดียว
                            </h2>

                            <p className="mt-1.5 text-xs text-emerald-50/90 sm:mt-2 sm:text-sm">
                                จัดการบัญชีผู้ใช้ เพิ่ม แก้ไข และตรวจสอบข้อมูลได้สะดวก
                            </p>
                        </div>

                        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex sm:h-20 sm:w-20">
                            <Users size={38} strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10"></div>
                    <div className="absolute -bottom-28 right-40 h-48 w-48 rounded-full bg-white/5"></div>
                </section>

                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:mb-7 xl:grid-cols-3">
                    {stats.map(stat => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
                            >
                                <div className={`absolute left-0 top-0 h-full w-1 ${stat.accent}`}></div>

                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            {stat.title}
                                        </p>

                                        <div className="mt-2 flex items-baseline gap-2 sm:mt-3">
                                            <span className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                                {stat.value.toLocaleString('th-TH')}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {stat.unit}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color} transition group-hover:scale-110 sm:h-12 sm:w-12`}>
                                        <Icon size={22} />
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between sm:mt-5">
                                    <p className="text-xs text-slate-400">
                                        {stat.description}
                                    </p>
                                    <ArrowUpRight
                                        size={16}
                                        className="text-slate-300 transition group-hover:text-emerald-600"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Users size={19} />
                                </div>

                                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                    รายชื่อสมาชิกทั้งหมด
                                </h2>
                            </div>

                            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                                ข้อมูลสมาชิกที่ลงทะเบียนในระบบ
                            </p>
                        </div>

                        <div className="relative w-full lg:max-w-xs">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="ค้นหาชื่อหรือ Username..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
                        <p className="text-xs text-slate-500">
                            แสดงข้อมูล
                            <span className="mx-1 font-bold text-emerald-700">
                                {filteredUsers.length.toLocaleString('th-TH')}
                            </span>
                            จาก {users.length.toLocaleString('th-TH')} สมาชิก
                        </p>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            สมาชิกทั้งหมด
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center px-6 py-14">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>
                            <p className="mt-3 text-sm text-slate-500">
                                กำลังโหลดข้อมูลสมาชิก...
                            </p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                                <Users size={34} />
                            </div>

                            <h3 className="mt-4 font-bold text-slate-700">
                                {search ? 'ไม่พบสมาชิกที่ค้นหา' : 'ยังไม่มีสมาชิกในระบบ'}
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                {search
                                    ? 'ลองค้นหาด้วยชื่อหรือ Username อื่น'
                                    : 'เริ่มต้นเพิ่มสมาชิกคนแรกของคุณ'}
                            </p>

                            {search ? (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                                >
                                    ล้างการค้นหา
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddUser}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    <UserPlus size={17} />
                                    เพิ่มสมาชิก
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f8faf9] text-xs uppercase tracking-wide text-slate-500">
                                            <th className="w-20 px-6 py-4 text-center font-semibold">
                                                ลำดับ
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                สมาชิก
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                Username
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                วันที่สร้าง
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                วันที่แก้ไข
                                            </th>
                                            <th className="px-6 py-4 text-center font-semibold">
                                                จัดการ
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((user, index) => (
                                            <tr
                                                key={user.UserId ?? index}
                                                className="transition-colors hover:bg-emerald-50/40"
                                            >
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                                                        {(index + 1).toLocaleString('th-TH')}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                            <UserRound size={20} />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-slate-700">
                                                                {user.name ?? '-'}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                สมาชิกระบบ
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700">
                                                        @{user.username ?? '-'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays size={15} className="text-slate-400" />
                                                        {formatDateThai(user.Created_At)}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays size={15} className="text-slate-400" />
                                                        {formatDateThai(user.Update_At)}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditUser(user)}
                                                            title="แก้ไขสมาชิก"
                                                            className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                                        >
                                                            <Pencil size={15} />
                                                            แก้ไข
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteUser(user)}
                                                            title="ลบสมาชิก"
                                                            className="flex h-9 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                                        >
                                                            <Trash2 size={15} />
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                                {filteredUsers.map((user, index) => (
                                    <article
                                        key={user.UserId ?? index}
                                        className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3 p-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                    <UserRound size={24} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs text-slate-400">
                                                        ลำดับที่ {(index + 1).toLocaleString('th-TH')}
                                                    </p>

                                                    <h3 className="mt-1 break-words text-sm font-bold text-slate-800">
                                                        {user.name ?? '-'}
                                                    </h3>

                                                    <p className="mt-1 break-all text-xs font-medium text-blue-600">
                                                        @{user.username ?? '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                                                สมาชิก
                                            </span>
                                        </div>

                                        <div className="mx-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    วันที่สร้าง
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-600">
                                                    {formatDateThai(user.Created_At)}
                                                </p>
                                            </div>

                                            <div className="border-l border-slate-200 pl-3">
                                                <p className="text-xs text-slate-400">
                                                    วันที่แก้ไข
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-600">
                                                    {formatDateThai(user.Update_At)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 p-3">
                                            <button
                                                type="button"
                                                onClick={() => handleEditUser(user)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                            >
                                                <Pencil size={16} />
                                                แก้ไข
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                            >
                                                <Trash2 size={16} />
                                                ลบสมาชิก
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:px-6">
                        <p className="text-xs text-slate-400">
                            BiwBoongShop · ระบบจัดการสมาชิก
                        </p>

                        <p className="text-xs font-medium text-slate-500">
                            ทั้งหมด {users.length.toLocaleString('th-TH')} สมาชิก
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}