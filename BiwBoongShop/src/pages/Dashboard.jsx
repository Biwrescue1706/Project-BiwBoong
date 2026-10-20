import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

import {
    getEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} from '../services/Dashboard.js';

export default function Dashboard() {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadEquipments = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getEquipments();
            const sortedEquipments = [...data].sort(
                (a, b) => Number(a.EID) - Number(b.EID)
            );

            setEquipments(sortedEquipments);
        } catch (err) {
            setError(err.message || 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEquipments();
    }, [loadEquipments]);

    async function handleAdd() {
        const result = await Swal.fire({
            title: `
            <div style="font-size:22px;font-weight:700;color:#0f172a;">
                เพิ่มอุปกรณ์ใหม่
            </div>
        `,
            html: `
            <div style="text-align:left;margin-top:20px;">
                <div style="margin-bottom:18px;">
                    <label for="equipment-name"
                        style="display:block;margin-bottom:8px;font-size:14px;font-weight:600;color:#334155;">
                        ชื่ออุปกรณ์
                    </label>
                    <input
                        id="equipment-name"
                        class="swal2-input"
                        type="text"
                        maxlength="150"
                        placeholder="เช่น คอมพิวเตอร์, เครื่องพิมพ์"
                        style="box-sizing:border-box;width:100%;margin:0;height:46px;border:1px solid #cbd5e1;border-radius:10px;padding:0 14px;font-size:15px;box-shadow:none;"
                    />
                </div>

                <div style="margin-bottom:8px;">
                    <label for="equipment-total"
                        style="display:block;margin-bottom:8px;font-size:14px;font-weight:600;color:#334155;">
                        จำนวนอุปกรณ์ทั้งหมด
                    </label>
                    <input
                        id="equipment-total"
                        class="swal2-input"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="กรอกจำนวนอุปกรณ์"
                        style="box-sizing:border-box;width:100%;margin:0;height:46px;border:1px solid #cbd5e1;border-radius:10px;padding:0 14px;font-size:15px;box-shadow:none;"
                    />
                    <p style="margin:8px 0 0;font-size:12px;color:#64748b;">
                        สามารถระบุจำนวน 0 ขึ้นไปได้
                    </p>
                </div>
            </div>
        `,
            width: '460px',
            padding: '28px',
            background: '#ffffff',
            color: '#0f172a',
            showCancelButton: true,
            confirmButtonText: 'บันทึกอุปกรณ์',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#15803d',
            cancelButtonColor: '#ea580c',
            buttonsStyling: true,
            reverseButtons: true,
            focusConfirm: false,
            allowOutsideClick: false,
            customClass: {
                popup: 'equipment-popup',
                confirmButton: 'equipment-confirm-btn',
                cancelButton: 'equipment-cancel-btn',
            },
            didOpen: () => {
                document.getElementById('equipment-name').focus();
            },
            preConfirm: () => {
                const nameInput = document.getElementById('equipment-name');
                const totalInput = document.getElementById('equipment-total');

                const name = nameInput.value.trim();
                const totalValue = totalInput.value;
                const total = Number(totalValue);

                if (!name) {
                    Swal.showValidationMessage('กรุณากรอกชื่ออุปกรณ์');
                    nameInput.focus();
                    return false;
                }

                if (
                    totalValue === '' ||
                    !Number.isInteger(total) ||
                    total < 0
                ) {
                    Swal.showValidationMessage(
                        'กรุณากรอกจำนวนเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
                    );
                    totalInput.focus();
                    return false;
                }

                return { name, total };
            },
        });

        if (!result.isConfirmed || !result.value) return;

        try {
            await createEquipment(
                result.value.name,
                result.value.total
            );

            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มอุปกรณ์สำเร็จ',
                text: `เพิ่ม "${result.value.name}" จำนวน ${result.value.total} ชิ้นเรียบร้อยแล้ว`,
                timer: 1800,
                timerProgressBar: true,
                showConfirmButton: false,
            });

            await loadEquipments();
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'เพิ่มอุปกรณ์ไม่สำเร็จ',
                text: err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#dc2626',
            });
        }
    }

    async function handleEdit(id) {
        try {
            const response = await getEquipmentById(id);
            const equipment = response?.equipment ?? response;

            if (!equipment || equipment.EID == null) {
                throw new Error('ไม่พบข้อมูลอุปกรณ์');
            }

            const result = await Swal.fire({
                title: `
                <div style="font-size:22px;font-weight:700;color:#0f172a;">
                    แก้ไขข้อมูลอุปกรณ์
                </div>
            `,
                html: `
                <div style="text-align:left;margin-top:20px;">
                    <div style="margin-bottom:18px;">
                        <h for="equipment-name"
                            style="display:block;margin-bottom:8px;font-size:14px;font-weight:600;color:#334155;">
                            ชื่ออุปกรณ์
                        </h>
                        <input
                            id="equipment-name"
                            class="swal2-input"
                            type="text"
                            maxlength="150"
                            placeholder="กรอกชื่ออุปกรณ์"
                            style="box-sizing:border-box;width:100%;margin:0;height:46px;border:1px solid #cbd5e1;border-radius:10px;padding:0 14px;font-size:15px;box-shadow:none;"
                        />
                    </div>

                    <div style="margin-bottom:8px;">
                        <label for="equipment-total"
                            style="display:block;margin-bottom:8px;font-size:14px;font-weight:600;color:#334155;">
                            จำนวนอุปกรณ์ทั้งหมด
                        </label>
                        <input
                            id="equipment-total"
                            class="swal2-input"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="กรอกจำนวนอุปกรณ์"
                            style="box-sizing:border-box;width:100%;margin:0;height:46px;border:1px solid #cbd5e1;border-radius:10px;padding:0 14px;font-size:15px;box-shadow:none;"
                        />
                        <p style="margin:8px 0 0;font-size:12px;color:#64748b;">
                            ระบุจำนวนเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป
                        </p>
                    </div>
                </div>
            `,
                width: '460px',
                padding: '28px',
                background: '#ffffff',
                color: '#0f172a',
                showCancelButton: true,
                confirmButtonText: 'บันทึกการแก้ไข',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#09ff00',
                cancelButtonColor: '#ea580c',
                buttonsStyling: true,
                reverseButtons: true,
                focusConfirm: false,
                allowOutsideClick: false,

                didOpen: () => {
                    const nameInput =
                        document.getElementById('equipment-name');

                    const totalInput =
                        document.getElementById('equipment-total');

                    nameInput.value = equipment.EName ?? '';
                    totalInput.value = equipment.Total ?? 0;

                    nameInput.focus();
                },

                preConfirm: () => {
                    const nameInput =
                        document.getElementById('equipment-name');

                    const totalInput =
                        document.getElementById('equipment-total');

                    const name = nameInput.value.trim();
                    const totalValue = totalInput.value;
                    const total = Number(totalValue);

                    if (!name) {
                        Swal.showValidationMessage(
                            'กรุณากรอกชื่ออุปกรณ์'
                        );
                        nameInput.focus();
                        return false;
                    }

                    if (
                        totalValue === '' ||
                        !Number.isInteger(total) ||
                        total < 0
                    ) {
                        Swal.showValidationMessage(
                            'กรุณากรอกจำนวนเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
                        );
                        totalInput.focus();
                        return false;
                    }

                    return { name, total };
                },
            });

            if (!result.isConfirmed || !result.value) return;

            await updateEquipment(
                id,
                result.value.name,
                result.value.total
            );

            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลสำเร็จ',
                html: `
                <p style="color:#64748b;font-size:14px;">
                    บันทึกข้อมูลอุปกรณ์
                    <strong style="color:#0f172a;">
                        ${result.value.name.replace(/[&<>"']/g, char => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                })[char])}
                    </strong>
                    เรียบร้อยแล้ว
                </p>
            `,
                timer: 1800,
                timerProgressBar: true,
                showConfirmButton: false,
            });

            await loadEquipments();
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'แก้ไขข้อมูลไม่สำเร็จ',
                text: err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#dc2626',
            });
        }
    }

    async function handleDelete(equipment) {
        const result = await Swal.fire({
            title: `
            <div style="font-size:22px;font-weight:700;color:#0f172a;">
                ยืนยันการลบอุปกรณ์
            </div>
        `,
            html: `
            <div style="margin-top:16px;text-align:center;">
                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    width:64px;
                    height:64px;
                    margin:0 auto 16px;
                    border-radius:50%;
                    background:#fef2f2;
                    color:#dc2626;
                    font-size:30px;
                ">
                    !
                </div>

                <p style="margin:0 0 8px;font-size:14px;color:#64748b;">
                    คุณกำลังจะลบอุปกรณ์รายการนี้
                </p>

                <div style="
                    padding:14px;
                    border:1px solid #fecaca;
                    border-radius:12px;
                    background:#fff7f7;
                ">
                    <p style="margin:0;font-size:16px;font-weight:700;color:#b91c1c;">
                        ${String(equipment.EName ?? '').replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[char])}
                    </p>
                    <p style="margin:6px 0 0;font-size:12px;color:#64748b;">
                        รหัสอุปกรณ์: ${String(equipment.EID ?? '').replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[char])}
                    </p>
                </div>

                <p style="margin:14px 0 0;font-size:13px;color:#dc2626;">
                    การลบข้อมูลนี้อาจไม่สามารถย้อนกลับได้
                </p>
            </div>
        `,
            width: '430px',
            padding: '28px',
            background: '#ffffff',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#a7ccfd',
            buttonsStyling: true,
            reverseButtons: true,
            focusCancel: true,
            allowOutsideClick: false,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteEquipment(equipment.EID);

            await Swal.fire({
                icon: 'success',
                title: 'ลบอุปกรณ์สำเร็จ',
                text: `ลบ "${equipment.EName}" เรียบร้อยแล้ว`,
                timer: 1800,
                timerProgressBar: true,
                showConfirmButton: false,
            });

            await loadEquipments();
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'ลบอุปกรณ์ไม่สำเร็จ',
                text: err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#dc2626',
            });
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:pt-24">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-1 text-sm font-semibold text-green-700">
                            ระบบจัดการอุปกรณ์
                        </p>

                        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                            รายการอุปกรณ์
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            จัดการข้อมูลและจำนวนอุปกรณ์ภายในระบบ
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={loadEquipments}
                            disabled={loading}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
                        </button>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800"
                        >
                            <Plus size={20} /> เพิ่มอุปกรณ์
                        </button>   
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">รายการอุปกรณ์</p>
                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {equipments.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">รายการ</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">จำนวนทั้งหมด</p>
                        <p className="mt-2 text-3xl font-bold text-blue-700">
                            {equipments.reduce(
                                (sum, item) => sum + (Number(item.Total) || 0),
                                0
                            )}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">ชิ้น</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">จำนวนพร้อมใช้งาน</p>
                        <p className="mt-2 text-3xl font-bold text-green-700">
                            {equipments.reduce(
                                (sum, item) => sum + (Number(item.Available) || 0),
                                0
                            )}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">ชิ้น</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <p className="font-semibold">โหลดข้อมูลไม่สำเร็จ</p>
                        <p className="mt-1">{error}</p>
                        <button
                            type="button"
                            onClick={loadEquipments}
                            className="mt-3 font-semibold underline"
                        >
                            ลองอีกครั้ง
                        </button>
                    </div>
                )}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="font-bold text-slate-800">
                            ข้อมูลอุปกรณ์ทั้งหมด
                        </h2>
                        <span className="text-sm text-slate-500">
                            {equipments.length} รายการ
                        </span>
                    </div>

                    {loading ? (
                        <div className="px-6 py-16 text-center text-slate-500">
                            กำลังโหลดข้อมูลอุปกรณ์...
                        </div>
                    ) : equipments.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <p className="font-semibold text-slate-700">
                                ยังไม่มีข้อมูลอุปกรณ์
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                กดปุ่มเพิ่มอุปกรณ์เพื่อเริ่มต้น
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">รหัส</th>
                                            <th className="px-5 py-4 font-semibold">ชื่ออุปกรณ์</th>
                                            <th className="px-5 py-4 text-center font-semibold">
                                                จำนวนทั้งหมด
                                            </th>
                                            <th className="px-5 py-4 text-center font-semibold">
                                                พร้อมใช้งาน
                                            </th>
                                            <th className="px-5 py-4 text-center font-semibold">
                                                แก้ไข
                                            </th>
                                            <th className="px-5 py-4 text-center font-semibold">
                                                ลบ
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {equipments.map((item) => (
                                            <tr
                                                key={item.EID}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4 text-slate-500">
                                                    {item.EID}
                                                </td>
                                                <td className="px-5 py-4 font-medium text-slate-800">
                                                    {item.EName}
                                                </td>
                                                <td className="px-5 py-4 text-center text-slate-700">
                                                    {item.Total ?? 0}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                        {item.Available ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(item.EID)}
                                                            title="แก้ไขอุปกรณ์"
                                                            aria-label="แก้ไขอุปกรณ์"
                                                            className="rounded-lg bg-orange-50 p-2.5 text-orange-600 transition-colors hover:bg-orange-100"
                                                        >
                                                            <Pencil size={24} />
                                                            <span className="ml-2">แก้ไข</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item)}
                                                            title="ลบอุปกรณ์"
                                                            aria-label="ลบอุปกรณ์"
                                                            className="rounded-lg bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100"
                                                        >
                                                            <Trash2 size={24} />
                                                            <span className="ml-2">ลบ</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                {equipments.map((item) => (
                                    <article
                                        key={item.EID}
                                        className="rounded-xl border border-slate-200 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    รหัสอุปกรณ์: {item.EID}
                                                </p>
                                                <h3 className="mt-1 font-bold text-slate-800">
                                                    {item.EName}
                                                </h3>
                                            </div>

                                            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                พร้อมใช้ {item.Available ?? 0}
                                            </span>
                                        </div>

                                        <div className="mt-4 rounded-lg bg-slate-50 p-3">
                                            <p className="text-sm text-slate-500">
                                                จำนวนทั้งหมด
                                            </p>
                                            <p className="mt-1 text-xl font-bold text-slate-800">
                                                {item.Total ?? 0} ชิ้น
                                            </p>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item.EID)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2.5 font-medium text-orange-700 transition-colors hover:bg-orange-100"
                                            >
                                                <Pencil size={24} />
                                                <span>แก้ไข</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 font-medium text-red-700 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 size={24} />
                                                <span>ลบ</span>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}
