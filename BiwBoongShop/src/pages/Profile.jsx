import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
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

export default function Profile() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadUsers() {
        setLoading(true);

        try {
            const data = await fetchUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ',
                text: error.message,
                confirmButtonText: 'ตกลง',
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function handleAddUser() {
        const result = await Swal.fire({
            title: 'เพิ่มสมาชิกใหม่',
            html: `
        <input id="reg-username" class="swal2-input" placeholder="Username" autocomplete="off">
        <input id="reg-name" class="swal2-input" placeholder="ชื่อจริง" autocomplete="name">
        <input id="reg-password" type="password" class="swal2-input" placeholder="รหัสผ่าน" autocomplete="new-password">
      `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'เพิ่มสมาชิก',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const username = document.getElementById('reg-username').value.trim();
                const name = document.getElementById('reg-name').value.trim();
                const password = document.getElementById('reg-password').value;

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
                title: 'เพิ่มสมาชิกสำเร็จเรียบร้อยแล้ว',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถเพิ่มสมาชิกได้',
            });
        }
    }

    async function handleEditUser(user) {
        const userId = user.UserId;
        const oldUsername = user.username ?? '';
        const oldName = user.name ?? '';

        const result = await Swal.fire({
            title: 'แก้ไขผู้ใช้',
            html: `
        <input id="edit-username" class="swal2-input" placeholder="Username" autocomplete="off">
        <input id="edit-name" class="swal2-input" placeholder="ชื่อจริง" autocomplete="name">
        <input id="edit-password" type="password" class="swal2-input" placeholder="รหัสผ่านใหม่ (ถ้าจะเปลี่ยน)" autocomplete="new-password">
      `,
            didOpen: () => {
                document.getElementById('edit-username').value = oldUsername;
                document.getElementById('edit-name').value = oldName;
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'บันทึก',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#059669',
            preConfirm: () => {
                const username = document.getElementById('edit-username').value.trim();
                const name = document.getElementById('edit-name').value.trim();
                const password = document.getElementById('edit-password').value;

                if (!username || !name) {
                    Swal.showValidationMessage('กรุณากรอก Username และชื่อให้ครบ');
                    return false;
                }

                const updateData = {};

                if (username !== oldUsername) updateData.username = username;
                if (name !== oldName) updateData.name = name;
                if (password) updateData.password = password;

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
                title: 'ข้อมูลถูกอัปเดตแล้ว',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถแก้ไขข้อมูลได้',
            });
        }
    }

    async function handleDeleteUser(user) {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: `คุณต้องการลบผู้ใช้ ${user.username ?? '-'} จริงหรือไม่`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่ ลบผู้ใช้',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#dc2626',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUser(user.UserId);
            await loadUsers();

            await Swal.fire({
                icon: 'success',
                title: 'ลบผู้ใช้สำเร็จ',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถลบผู้ใช้ได้',
            });
        }
    }

    return (
        <>
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:pt-24">
                <div className="mx-auto max-w-[1600px]">
                    <section className="mb-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                                        <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.67 0-8 1.34-8 4v2h12v-2c0-2.66-1.33-4-4-4Zm8 0c-.33 0-.7.02-1.1.06 1.27.92 2.1 2.25 2.1 3.94v2h7v-2c0-2.66-5.33-4-8-4Z" />
                                    </svg>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        รายชื่อผู้ใช้ทั้งหมด
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        จัดการข้อมูลผู้ใช้งานในระบบ
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddUser}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                            >
                                <span className="text-lg">+</span>
                                เพิ่มสมาชิก
                            </button>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5 sm:px-6">
                            <div>
                                <h2 className="font-bold text-gray-800">ผู้ใช้งานระบบ</h2>
                                <p className="mt-1 text-xs text-gray-400">
                                    รายชื่อผู้ใช้งานทั้งหมด
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                    <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.67 0-8 1.34-8 4v2h12v-2c0-2.66-1.33-4-4-4Zm8 0c-.33 0-.7.02-1.1.06 1.27.92 2.1 2.25 2.1 3.94v2h7v-2c0-2.66-5.33-4-8-4Z" />
                                </svg>
                            </div>
                        </div>

                        {/* ตาราง: แสดงบนแท็บเล็ตและคอมพิวเตอร์ ตั้งแต่ 768px ขึ้นไป */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full border-collapse text-center">
                                <thead>
                                    <tr className="bg-emerald-50 text-sm font-semibold text-emerald-900">
                                        <th className="border-b border-emerald-100 px-5 py-4">ลำดับ</th>
                                        <th className="border-b border-emerald-100 px-5 py-4">Username</th>
                                        <th className="border-b border-emerald-100 px-5 py-4">ชื่อ</th>
                                        <th className="border-b border-emerald-100 px-5 py-4">วันที่สร้าง</th>
                                        <th className="border-b border-emerald-100 px-5 py-4">วันที่แก้ไข</th>
                                        <th className="border-b border-emerald-100 px-5 py-4">แก้ไข</th>
                                        <th className="border-b border-emerald-100 px-5 py-4">ลบ</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-12 text-gray-500">
                                                กำลังโหลดรายชื่อผู้ใช้งาน...
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-12 text-gray-400">
                                                ไม่พบรายชื่อผู้ใช้งาน
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <tr key={user.UserId ?? index} className="transition hover:bg-emerald-50/50">
                                                <td className="border-b border-gray-200 px-5 py-5">{index + 1}</td>
                                                <td className="border-b border-gray-200 px-5 py-5">{user.username ?? '-'}</td>
                                                <td className="border-b border-gray-200 px-5 py-5">{user.name ?? '-'}</td>
                                                <td className="border-b border-gray-200 px-5 py-5">{formatDateThai(user.Created_At)}</td>
                                                <td className="border-b border-gray-200 px-5 py-5">{formatDateThai(user.Update_At)}</td>
                                                <td className="border-b border-gray-200 px-5 py-5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditUser(user)}
                                                        title="แก้ไข"
                                                        aria-label="แก้ไขผู้ใช้งาน"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 active:scale-95"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                                <td className="border-b border-gray-200 px-5 py-5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(user)}
                                                        title="ลบ"
                                                        aria-label="ลบผู้ใช้งาน"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 hover:text-red-800 active:scale-95"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                            <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* การ์ด: แสดงบนมือถือและหน้าจอที่เล็กกว่า 768px */}
                        <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                            {loading ? (
                                <p className="py-10 text-center text-sm text-gray-500">
                                    กำลังโหลดรายชื่อผู้ใช้งาน...
                                </p>
                            ) : users.length === 0 ? (
                                <p className="py-10 text-center text-sm text-gray-400">
                                    ไม่พบรายชื่อผู้ใช้งาน
                                </p>
                            ) : (
                                users.map((user, index) => (
                                    <article
                                        key={user.UserId ?? index}
                                        className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">ลำดับที่ {index + 1}</p>
                                                <h3 className="mt-1 break-words font-bold text-gray-800">
                                                    {user.name ?? '-'}
                                                </h3>
                                                <p className="mt-1 break-all text-sm text-emerald-700">
                                                    @{user.username ?? '-'}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                ผู้ใช้งาน
                                            </span>
                                        </div>

                                        <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                                            <div className="flex justify-between gap-3">
                                                <span className="text-gray-500">วันที่สร้าง</span>
                                                <span className="text-right text-gray-700">
                                                    {formatDateThai(user.Created_At)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-gray-500">วันที่แก้ไข</span>
                                                <span className="text-right text-gray-700">
                                                    {formatDateThai(user.Update_At)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditUser(user)}
                                                className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user)}
                                                className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                                            >
                                                ลบผู้ใช้
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}