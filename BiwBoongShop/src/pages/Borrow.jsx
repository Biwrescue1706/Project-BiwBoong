import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Search,
    Package,
    Boxes,
    CheckCircle2,
    ArrowUpRight,
    RefreshCw,
    ClipboardList,
    Info,
    HandHelping,
    X,
    PackageCheck,
    CircleAlert,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import { fetchUserProfile } from '../services/auth.js';
import {
    getBorrowEquipments,
    borrowEquipment as submitBorrow,
} from '../services/Borrow.js';

function getDisplayName(user) {
    return (
        user?.name ??
        user?.Name ??
        user?.username ??
        user?.Username ??
        ''
    );
}

export default function Borrow() {
    const [user, setUser] = useState(null);
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [submittingId, setSubmittingId] = useState(null);

    const loadEquipments = useCallback(async (signal) => {
        setLoading(true);
        setError('');

        try {
            const data = await getBorrowEquipments({ signal });
            setEquipments(data);
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message || 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้');
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        async function initialize() {
            try {
                const profile = await fetchUserProfile();

                if (!active) return;

                setUser(profile);
                await loadEquipments(controller.signal);
            } catch {
                if (active) {
                    setError('ไม่สามารถตรวจสอบผู้ใช้งานได้ กรุณาเข้าสู่ระบบใหม่');
                    setLoading(false);
                }
            }
        }

        initialize();

        return () => {
            active = false;
            controller.abort();
        };
    }, [loadEquipments]);

    const filteredEquipments = useMemo(() => {
        const keyword = search.trim().toLocaleLowerCase('th');

        if (!keyword) return equipments;

        return equipments.filter(item =>
            String(item.EName ?? '')
                .toLocaleLowerCase('th')
                .includes(keyword)
        );
    }, [equipments, search]);

    const totalEquipment = useMemo(
        () => equipments.reduce(
            (sum, item) => sum + Math.max(0, Number(item.Total ?? 0)),
            0
        ),
        [equipments]
    );

    const totalAvailable = useMemo(
        () => equipments.reduce(
            (sum, item) => sum + Math.max(0, Number(item.Available ?? 0)),
            0
        ),
        [equipments]
    );

    const unavailable = Math.max(totalEquipment - totalAvailable, 0);

    async function handleBorrow(equipment) {
        const equipmentId = Number(equipment.EID);
        const available = Math.max(0, Number(equipment.Available ?? 0));
        const equipmentName = String(equipment.EName ?? '');

        if (!equipmentId || available <= 0) return;
        if (submittingId !== null) return;

        const defaultName = getDisplayName(user);

        const result = await Swal.fire({
            title: 'กรอกข้อมูลการยืม',
            html: `
                <div style="text-align:left">
                    <div style="background:#ecfdf5;padding:13px;border-radius:12px;margin-bottom:20px;">
                        <p style="font-size:12px;color:#64748b;margin-bottom:5px;">
                            อุปกรณ์ที่เลือก
                        </p>
                        <strong style="font-size:16px;color:#047857;">
                            ${equipmentName.replace(/[&<>"']/g, char => ({
                                '&': '&amp;',
                                '<': '&lt;',
                                '>': '&gt;',
                                '"': '&quot;',
                                "'": '&#39;',
                            })[char])}
                        </strong>
                    </div>

                    <label for="borrower-name"
                        style="display:block;margin-bottom:7px;font-size:14px;font-weight:600;color:#334155;">
                        ชื่อผู้ยืม
                    </label>

                    <input
                        id="borrower-name"
                        class="swal2-input"
                        style="box-sizing:border-box;width:100%;margin:0 0 18px;height:46px;border:1px solid #dbe3e8;border-radius:10px;padding:0 12px;box-shadow:none;"
                        placeholder="ชื่อผู้ยืม"
                        autocomplete="name"
                    />

                    <label for="borrower-quantity"
                        style="display:block;margin-bottom:7px;font-size:14px;font-weight:600;color:#334155;">
                        จำนวนที่ต้องการยืม
                    </label>

                    <input
                        id="borrower-quantity"
                        class="swal2-input"
                        style="box-sizing:border-box;width:100%;margin:0;height:46px;border:1px solid #dbe3e8;border-radius:10px;padding:0 12px;box-shadow:none;"
                        type="number"
                        min="1"
                        max="${available}"
                        step="1"
                        value="1"
                    />

                    <p style="margin-top:9px;font-size:12px;color:#64748b;">
                        จำนวนคงเหลือ ${available.toLocaleString('th-TH')} ชิ้น
                    </p>
                </div>
            `,
            didOpen: () => {
                const input = document.getElementById('borrower-name');
                if (input) input.value = defaultName;
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'ยืนยันการยืม',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#64748b',
            reverseButtons: true,
            preConfirm: () => {
                const name = document
                    .getElementById('borrower-name')
                    ?.value.trim() ?? '';

                const quantity = Number(
                    document.getElementById('borrower-quantity')?.value
                );

                if (!name) {
                    Swal.showValidationMessage('กรุณากรอกชื่อผู้ยืม');
                    return false;
                }

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    quantity > available
                ) {
                    Swal.showValidationMessage(
                        `กรุณาระบุจำนวนเต็มระหว่าง 1 ถึง ${available}`
                    );
                    return false;
                }

                return { name, quantity };
            },
        });

        if (!result.isConfirmed || !result.value) return;

        setSubmittingId(equipmentId);

        try {
            await submitBorrow({
                equipmentId,
                equipmentName,
                quantity: result.value.quantity,
                borrowerName: result.value.name,
            });

            await Swal.fire({
                icon: 'success',
                title: 'ยืมอุปกรณ์สำเร็จ',
                text: `${equipmentName} จำนวน ${result.value.quantity} ชิ้น`,
                timer: 1600,
                showConfirmButton: false,
            });

            await loadEquipments();
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'ยืมอุปกรณ์ไม่สำเร็จ',
                text: err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
        } finally {
            setSubmittingId(null);
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
            description: 'รายการทั้งหมดในระบบ',
        },
        {
            title: 'จำนวนทั้งหมด',
            value: totalEquipment,
            unit: 'ชิ้น',
            icon: Boxes,
            color: 'bg-violet-50 text-violet-600',
            accent: 'bg-violet-500',
            description: 'อุปกรณ์ทั้งหมด',
        },
        {
            title: 'พร้อมให้ยืม',
            value: totalAvailable,
            unit: 'ชิ้น',
            icon: CheckCircle2,
            color: 'bg-emerald-50 text-emerald-600',
            accent: 'bg-emerald-500',
            description: 'อุปกรณ์ที่ยังคงเหลือ',
        },
        {
            title: 'ถูกยืมไปแล้ว',
            value: unavailable,
            unit: 'ชิ้น',
            icon: PackageCheck,
            color: 'bg-orange-50 text-orange-600',
            accent: 'bg-orange-500',
            description: 'อุปกรณ์ที่ไม่คงเหลือ',
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7f6] text-slate-800">
            <Navbar />

            <main className="mx-auto max-w-[1450px] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 md:pb-12 md:pt-24 lg:px-8">

                <section className="mb-5 flex flex-col justify-between gap-4 lg:mb-7 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            EQUIPMENT BORROWING
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            ยืมอุปกรณ์
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
                            เลือกอุปกรณ์ที่ต้องการยืมและตรวจสอบจำนวนคงเหลือ
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadEquipments()}
                        disabled={loading}
                        className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? 'animate-spin' : ''}
                        />
                        รีเฟรชข้อมูล
                    </button>
                </section>

                <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#087f68] via-[#109879] to-[#22a887] px-5 py-5 text-white shadow-lg shadow-emerald-900/10 sm:mb-7 sm:px-8 sm:py-7">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-emerald-100 sm:text-sm">
                                EQUIPMENT SERVICE
                            </p>

                            <h2 className="mt-1.5 text-xl font-bold sm:mt-2 sm:text-3xl">
                                เลือกยืมได้ตามต้องการ
                            </h2>

                            <p className="mt-1.5 text-xs text-emerald-50/90 sm:mt-2 sm:text-sm">
                                ตรวจสอบอุปกรณ์และจำนวนคงเหลือก่อนทำรายการ
                            </p>
                        </div>

                        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex sm:h-20 sm:w-20">
                            <HandHelping size={40} strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10"></div>
                    <div className="absolute -bottom-28 right-40 h-48 w-48 rounded-full bg-white/5"></div>
                </section>

                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:mb-7 xl:grid-cols-4">
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

                <section className="mb-5 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                    <div className="flex items-start gap-3 bg-[#f0faf6] px-4 py-4 sm:items-center sm:px-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <Info size={21} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-sm font-bold text-emerald-900">
                                วิธีการยืมอุปกรณ์
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-emerald-800/80 sm:text-sm">
                                เลือกอุปกรณ์ที่ต้องการ กดปุ่มยืม กรอกชื่อผู้ยืมและจำนวนที่ต้องการ จากนั้นกดยืนยัน
                            </p>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <ClipboardList size={19} />
                                </div>

                                <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                                    รายการอุปกรณ์ทั้งหมด
                                </h2>
                            </div>

                            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                                ตรวจสอบจำนวนคงเหลือก่อนทำรายการ
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
                                placeholder="ค้นหาชื่ออุปกรณ์..."
                                aria-label="ค้นหาชื่ออุปกรณ์"
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
                                {filteredEquipments.length.toLocaleString('th-TH')}
                            </span>
                            จาก {equipments.length.toLocaleString('th-TH')} รายการ
                        </p>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            พร้อมให้บริการ
                        </span>
                    </div>

                    {error && (
                        <div className="m-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:m-5">
                            <div className="flex items-start gap-2">
                                <CircleAlert size={19} className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">ไม่สามารถโหลดข้อมูลได้</p>
                                    <p className="mt-1">{error}</p>

                                    <button
                                        type="button"
                                        onClick={() => loadEquipments()}
                                        className="mt-2 font-semibold underline"
                                    >
                                        ลองอีกครั้ง
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                                {search ? 'ไม่พบอุปกรณ์ที่ค้นหา' : 'ไม่มีข้อมูลอุปกรณ์'}
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                {search
                                    ? 'ลองค้นหาด้วยชื่ออุปกรณ์อื่น'
                                    : 'ขณะนี้ยังไม่มีอุปกรณ์ในระบบ'}
                            </p>

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                                >
                                    ล้างการค้นหา
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:hidden">
                                {filteredEquipments.map((item, index) => {
                                    const available = Math.max(0, Number(item.Available ?? 0));
                                    const total = Math.max(0, Number(item.Total ?? 0));
                                    const isSubmitting = submittingId === Number(item.EID);
                                    const inUse = Math.max(total - available, 0);
                                    const percent = total > 0
                                        ? Math.min((available / total) * 100, 100)
                                        : 0;

                                    return (
                                        <article
                                            key={item.EID ?? `${item.EName}-${index}`}
                                            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-3 p-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                                        available > 0
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                        <Package size={23} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-slate-400">
                                                            รายการที่ {(index + 1).toLocaleString('th-TH')}
                                                        </p>

                                                        <h3 className="mt-1 break-words text-sm font-bold text-slate-800">
                                                            {item.EName ?? '-'}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                                    available > 0
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-red-50 text-red-600'
                                                }`}>
                                                    {available > 0 ? 'พร้อมให้ยืม' : 'หมด'}
                                                </span>
                                            </div>

                                            <div className="px-4 pb-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="rounded-xl bg-blue-50/70 p-3">
                                                        <p className="text-xs text-slate-500">
                                                            จำนวนทั้งหมด
                                                        </p>
                                                        <p className="mt-1 text-xl font-bold text-slate-800">
                                                            {total.toLocaleString('th-TH')}
                                                            <span className="ml-1 text-xs font-normal text-slate-400">ชิ้น</span>
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-emerald-50/70 p-3">
                                                        <p className="text-xs text-slate-500">
                                                            พร้อมให้ยืม
                                                        </p>
                                                        <p className={`mt-1 text-xl font-bold ${
                                                            available > 0 ? 'text-emerald-700' : 'text-red-600'
                                                        }`}>
                                                            {available.toLocaleString('th-TH')}
                                                            <span className="ml-1 text-xs font-normal text-slate-400">ชิ้น</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <div className="mb-1.5 flex items-center justify-between text-xs">
                                                        <span className="text-slate-400">จำนวนคงเหลือ</span>
                                                        <span className="font-semibold text-slate-600">
                                                            {Math.round(percent)}%
                                                        </span>
                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${
                                                                available > 0 ? 'bg-emerald-500' : 'bg-red-400'
                                                            }`}
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>

                                                    <p className="mt-2 text-xs text-slate-400">
                                                        ถูกยืมไปแล้ว {inUse.toLocaleString('th-TH')} ชิ้น
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-100 bg-slate-50/60 p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleBorrow(item)}
                                                    disabled={available <= 0 || submittingId !== null}
                                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
                                                        available > 0
                                                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700'
                                                            : 'cursor-not-allowed bg-slate-200 text-slate-400'
                                                    } disabled:cursor-not-allowed disabled:opacity-60`}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <RefreshCw size={17} className="animate-spin" />
                                                            กำลังดำเนินการ...
                                                        </>
                                                    ) : available > 0 ? (
                                                        <>
                                                            <HandHelping size={18} />
                                                            ยืมอุปกรณ์
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X size={17} />
                                                            อุปกรณ์หมด
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="hidden overflow-x-auto xl:block">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f8faf9] text-xs uppercase tracking-wide text-slate-500">
                                            <th className="w-20 px-6 py-4 text-center font-semibold">ลำดับ</th>
                                            <th className="px-6 py-4 font-semibold">ชื่ออุปกรณ์</th>
                                            <th className="w-36 px-6 py-4 text-center font-semibold">จำนวนทั้งหมด</th>
                                            <th className="w-36 px-6 py-4 text-center font-semibold">พร้อมให้ยืม</th>
                                            <th className="w-40 px-6 py-4 text-center font-semibold">สถานะ</th>
                                            <th className="w-40 px-6 py-4 text-center font-semibold">ดำเนินการ</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredEquipments.map((item, index) => {
                                            const available = Math.max(0, Number(item.Available ?? 0));
                                            const total = Math.max(0, Number(item.Total ?? 0));
                                            const isSubmitting = submittingId === Number(item.EID);

                                            return (
                                                <tr
                                                    key={item.EID ?? `${item.EName}-${index}`}
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
                                                                <Package size={19} />
                                                            </div>

                                                            <span className="font-semibold text-slate-700">
                                                                {item.EName ?? '-'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-center font-semibold text-slate-700">
                                                        {total.toLocaleString('th-TH')}
                                                        <span className="ml-1 text-xs font-normal text-slate-400">ชิ้น</span>
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex min-w-16 items-center justify-center rounded-lg px-3 py-2 font-bold ${
                                                            available > 0
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            {available.toLocaleString('th-TH')}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                            available > 0
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${
                                                                available > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                                            }`}></span>
                                                            {available > 0 ? 'พร้อมให้ยืม' : 'อุปกรณ์หมด'}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleBorrow(item)}
                                                            disabled={available <= 0 || submittingId !== null}
                                                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                                                                available > 0
                                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                                                            } disabled:opacity-60`}
                                                        >
                                                            {isSubmitting ? (
                                                                <>
                                                                    <RefreshCw size={15} className="animate-spin" />
                                                                    กำลังดำเนินการ
                                                                </>
                                                            ) : available > 0 ? (
                                                                <>
                                                                    <HandHelping size={16} />
                                                                    ยืมอุปกรณ์
                                                                </>
                                                            ) : (
                                                                'อุปกรณ์หมด'
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:px-6">
                        <p className="text-xs text-slate-400">
                            BiwBoongShop · ระบบจัดการอุปกรณ์
                        </p>

                        <p className="text-xs font-medium text-slate-500">
                            ทั้งหมด {filteredEquipments.length.toLocaleString('th-TH')} รายการ
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
