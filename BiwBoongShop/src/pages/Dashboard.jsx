
import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Pencil,
    Trash2,
    Plus,
    Search,
    RefreshCw,
    Package,
    Boxes,
    CheckCircle2,
    PackageCheck,
    ArrowUpRight,
    Wrench,
    X,
} from 'lucide-react';
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
    const [search, setSearch] = useState('');

    const loadEquipments = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getEquipments();
            setEquipments(
                [...data].sort((a, b) => Number(a.EID) - Number(b.EID))
            );
        } catch (err) {
            setError(err.message || 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEquipments();
    }, [loadEquipments]);

    const filteredEquipments = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return equipments;

        return equipments.filter(item =>
            String(item.EID).toLowerCase().includes(keyword) ||
            String(item.EName || '').toLowerCase().includes(keyword)
        );
    }, [equipments, search]);

    const totalEquipment = equipments.reduce(
        (sum, item) => sum + (Number(item.Total) || 0), 0
    );

    const availableEquipment = equipments.reduce(
        (sum, item) => sum + (Number(item.Available) || 0), 0
    );

    const usedEquipment = Math.max(totalEquipment - availableEquipment, 0);

    const escapeHTML = value =>
        String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        })[char]);

    async function showEquipmentForm(equipment = null) {
        const isEdit = Boolean(equipment);

        const result = await Swal.fire({
            title: isEdit ? 'แก้ไขข้อมูลอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่',
            html: `
                <div style="text-align:left;margin-top:12px;">
                    <label style="display:block;margin-bottom:7px;font-size:14px;font-weight:600;color:#334155;">
                        ชื่ออุปกรณ์
                    </label>
                    <input
                        id="equipment-name"
                        class="swal2-input"
                        type="text"
                        maxlength="150"
                        placeholder="กรอกชื่ออุปกรณ์"
                        value="${escapeHTML(equipment?.EName || '')}"
                        style="box-sizing:border-box;width:100%;margin:0 0 20px;height:46px;border:1px solid #dbe3e8;border-radius:10px;padding:0 13px;font-size:15px;box-shadow:none;"
                    />

                    <label style="display:block;margin-bottom:7px;font-size:14px;font-weight:600;color:#334155;">
                        จำนวนอุปกรณ์ทั้งหมด
                    </label>
                    <input
                        id="equipment-total"
                        class="swal2-input"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="กรอกจำนวน"
                        value="${equipment?.Total ?? ''}"
                        style="box-sizing:border-box;width:100%;margin:0;height:46px;border:1px solid #dbe3e8;border-radius:10px;padding:0 13px;font-size:15px;box-shadow:none;"
                    />
                    <p style="font-size:12px;color:#94a3b8;margin-top:8px;">
                        ระบุจำนวนเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป
                    </p>
                </div>
            `,
            width: '440px',
            padding: '28px',
            showCancelButton: true,
            confirmButtonText: isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#15966b',
            cancelButtonColor: '#64748b',
            reverseButtons: true,
            focusConfirm: false,
            allowOutsideClick: false,

            didOpen: () => {
                document.getElementById('equipment-name')?.focus();
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

                if (totalValue === '' || !Number.isInteger(total) || total < 0) {
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
            if (isEdit) {
                await updateEquipment(
                    equipment.EID,
                    result.value.name,
                    result.value.total
                );
            } else {
                await createEquipment(
                    result.value.name,
                    result.value.total
                );
            }

            await Swal.fire({
                icon: 'success',
                title: isEdit ? 'แก้ไขข้อมูลสำเร็จ' : 'เพิ่มอุปกรณ์สำเร็จ',
                text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                timer: 1600,
                showConfirmButton: false,
            });

            await loadEquipments();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: err.message || 'กรุณาลองใหม่อีกครั้ง',
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

            await showEquipmentForm(equipment);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถโหลดข้อมูลได้',
                text: err.message || 'กรุณาลองใหม่อีกครั้ง',
                confirmButtonColor: '#dc2626',
            });
        }
    }

    async function handleDelete(equipment) {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            html: `
                <div style="padding:12px 0;">
                    <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:18px;background:#fff1f0;display:flex;align-items:center;justify-content:center;color:#e05252;">
                        <span style="font-size:32px;font-weight:bold;">!</span>
                    </div>
                    <p style="color:#64748b;font-size:14px;margin-bottom:10px;">
                        คุณต้องการลบอุปกรณ์รายการนี้ใช่หรือไม่
                    </p>
                    <div style="background:#fff7f6;border:1px solid #ffe0dc;padding:14px;border-radius:12px;">
                        <strong style="color:#c2413b;font-size:16px;">
                            ${escapeHTML(equipment.EName)}
                        </strong>
                        <p style="color:#94a3b8;font-size:12px;margin-top:5px;">
                            รหัสอุปกรณ์: ${escapeHTML(equipment.EID)}
                        </p>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'ยืนยันลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#dc5252',
            cancelButtonColor: '#64748b',
            reverseButtons: true,
            focusCancel: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteEquipment(equipment.EID);

            await Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                timer: 1500,
                showConfirmButton: false,
            });

            await loadEquipments();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ลบข้อมูลไม่สำเร็จ',
                text: err.message || 'กรุณาลองใหม่อีกครั้ง',
                confirmButtonColor: '#dc2626',
            });
        }
    }

    const stats = [
        {
            title: 'รายการอุปกรณ์',
            value: equipments.length,
            unit: 'รายการ',
            icon: Package,
            color: 'bg-blue-50 text-blue-600',
            accent: 'bg-blue-500',
            description: 'อุปกรณ์ทั้งหมดในระบบ',
        },
        {
            title: 'จำนวนอุปกรณ์',
            value: totalEquipment,
            unit: 'ชิ้น',
            icon: Boxes,
            color: 'bg-violet-50 text-violet-600',
            accent: 'bg-violet-500',
            description: 'จำนวนอุปกรณ์ทั้งหมด',
        },
        {
            title: 'พร้อมใช้งาน',
            value: availableEquipment,
            unit: 'ชิ้น',
            icon: CheckCircle2,
            color: 'bg-emerald-50 text-emerald-600',
            accent: 'bg-emerald-500',
            description: 'อุปกรณ์ที่ยังพร้อมใช้งาน',
        },
        {
            title: 'กำลังถูกใช้งาน',
            value: usedEquipment,
            unit: 'ชิ้น',
            icon: PackageCheck,
            color: 'bg-orange-50 text-orange-600',
            accent: 'bg-orange-500',
            description: 'อุปกรณ์ที่ถูกนำไปใช้งาน',
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7f6]">
            <Navbar />

            <main className="mx-auto max-w-[1450px] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 md:pb-12 md:pt-24 lg:px-8">

                <div className="mb-5 flex flex-col justify-between gap-4 lg:mb-7 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            EQUIPMENT MANAGEMENT
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            จัดการอุปกรณ์
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
                            จัดการข้อมูล ตรวจสอบจำนวน และติดตามสถานะอุปกรณ์ทั้งหมด
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={loadEquipments}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                        >
                            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                            รีเฟรช
                        </button>

                        <button
                            type="button"
                            onClick={() => showEquipmentForm()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            <Plus size={19} />
                            เพิ่มอุปกรณ์
                        </button>
                    </div>
                </div>

                <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#087f68] via-[#109879] to-[#22a887] px-5 py-5 text-white shadow-lg shadow-emerald-900/10 sm:mb-7 sm:px-8 sm:py-7">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-emerald-100 sm:text-sm">
                                ภาพรวมการจัดการอุปกรณ์
                            </p>

                            <h2 className="mt-1.5 text-xl font-bold sm:mt-2 sm:text-3xl">
                                ทุกอย่างพร้อมจัดการในที่เดียว
                            </h2>

                            <p className="mt-1.5 text-xs text-emerald-50/90 sm:mt-2 sm:text-sm">
                                ตรวจสอบข้อมูลและสถานะอุปกรณ์ได้อย่างสะดวก
                            </p>
                        </div>

                        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex sm:h-20 sm:w-20">
                            <Wrench size={38} strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10"></div>
                    <div className="absolute -bottom-28 right-40 h-48 w-48 rounded-full bg-white/5"></div>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:mb-8 xl:grid-cols-4">
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
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Package size={19} />
                                </div>

                                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                    รายการอุปกรณ์ทั้งหมด
                                </h2>
                            </div>

                            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                                ข้อมูลอุปกรณ์ที่อยู่ในระบบ
                            </p>
                        </div>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="ค้นหาชื่อหรือรหัสอุปกรณ์..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50 sm:w-72"
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

                    {error && (
                        <div className="m-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                            <p className="font-semibold">ไม่สามารถโหลดข้อมูลได้</p>
                            <p className="mt-1">{error}</p>

                            <button
                                type="button"
                                onClick={loadEquipments}
                                className="mt-2 font-semibold underline"
                            >
                                ลองอีกครั้ง
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
                        <p className="text-xs text-slate-500">
                            แสดงข้อมูล
                            <span className="mx-1 font-bold text-emerald-700">
                                {filteredEquipments.length}
                            </span>
                            จาก {equipments.length} รายการ
                        </p>

                        {search && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                ผลการค้นหา
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center px-6 py-14">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>
                            <p className="mt-3 text-sm text-slate-500">
                                กำลังโหลดข้อมูลอุปกรณ์...
                            </p>
                        </div>
                    ) : filteredEquipments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                                <Package size={34} />
                            </div>

                            <h3 className="mt-4 font-bold text-slate-700">
                                {search ? 'ไม่พบอุปกรณ์ที่ค้นหา' : 'ยังไม่มีข้อมูลอุปกรณ์'}
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                {search
                                    ? 'ลองค้นหาด้วยชื่อหรือรหัสอุปกรณ์อื่น'
                                    : 'เริ่มต้นเพิ่มอุปกรณ์รายการแรกของคุณ'}
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
                                    onClick={() => showEquipmentForm()}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    <Plus size={17} />
                                    เพิ่มอุปกรณ์
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f8faf9] text-xs uppercase tracking-wide text-slate-500">
                                            <th className="px-6 py-4 font-semibold">รหัส</th>
                                            <th className="px-6 py-4 font-semibold">ชื่ออุปกรณ์</th>
                                            <th className="px-6 py-4 text-center font-semibold">จำนวนทั้งหมด</th>
                                            <th className="px-6 py-4 text-center font-semibold">พร้อมใช้งาน</th>
                                            <th className="px-6 py-4 text-center font-semibold">สถานะ</th>
                                            <th className="px-6 py-4 text-center font-semibold">จัดการ</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredEquipments.map(item => {
                                            const total = Number(item.Total) || 0;
                                            const available = Number(item.Available) || 0;
                                            const isAvailable = available > 0;

                                            return (
                                                <tr
                                                    key={item.EID}
                                                    className="group transition-colors hover:bg-emerald-50/40"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs font-semibold text-slate-600">
                                                            #{item.EID}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                                <Package size={19} />
                                                            </div>
                                                            <span className="font-semibold text-slate-700">
                                                                {item.EName}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-semibold text-slate-700">
                                                            {total.toLocaleString('th-TH')}
                                                        </span>
                                                        <span className="ml-1 text-xs text-slate-400">ชิ้น</span>
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex min-w-16 items-center justify-center rounded-lg bg-emerald-50 px-3 py-2 font-bold text-emerald-700">
                                                            {available.toLocaleString('th-TH')}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                            isAvailable
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${
                                                                isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                                                            }`}></span>
                                                            {isAvailable ? 'พร้อมใช้งาน' : 'หมด'}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEdit(item.EID)}
                                                                className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                                            >
                                                                <Pencil size={15} />
                                                                แก้ไข
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item)}
                                                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                                            >
                                                                <Trash2 size={15} />
                                                                ลบ
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                                {filteredEquipments.map(item => {
                                    const total = Number(item.Total) || 0;
                                    const available = Number(item.Available) || 0;
                                    const isAvailable = available > 0;

                                    return (
                                        <article
                                            key={item.EID}
                                            className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-3 p-3.5">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                        <Package size={22} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-slate-400">
                                                            รหัส #{item.EID}
                                                        </p>
                                                        <h3 className="mt-1 break-words text-sm font-bold text-slate-800">
                                                            {item.EName}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                                    isAvailable
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-red-50 text-red-600'
                                                }`}>
                                                    {isAvailable ? 'พร้อมใช้' : 'หมด'}
                                                </span>
                                            </div>

                                            <div className="mx-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                                                <div>
                                                    <p className="text-xs text-slate-400">จำนวนทั้งหมด</p>
                                                    <p className="mt-1 text-lg font-bold text-slate-700">
                                                        {total.toLocaleString('th-TH')}
                                                        <span className="ml-1 text-xs font-normal text-slate-400">ชิ้น</span>
                                                    </p>
                                                </div>

                                                <div className="border-l border-slate-200 pl-4">
                                                    <p className="text-xs text-slate-400">พร้อมใช้งาน</p>
                                                    <p className="mt-1 text-lg font-bold text-emerald-600">
                                                        {available.toLocaleString('th-TH')}
                                                        <span className="ml-1 text-xs font-normal text-slate-400">ชิ้น</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(item.EID)}
                                                    className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                                                >
                                                    <Pencil size={16} />
                                                    แก้ไข
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item)}
                                                    className="flex items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                                >
                                                    <Trash2 size={16} />
                                                    ลบ
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:px-6">
                        <p className="text-xs text-slate-400">
                            BiwBoongShop · ระบบจัดการอุปกรณ์
                        </p>

                        <p className="text-xs font-medium text-slate-500">
                            ทั้งหมด {equipments.length} รายการ
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
