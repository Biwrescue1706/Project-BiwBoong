import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    History,
    ClipboardList,
    RotateCcw,
    RefreshCw,
    AlertCircle,
    Search,
    Package,
    CheckCircle2,
    Clock3,
    CalendarDays,
    UserRound,
    Wrench,
    X,
    ArrowUpRight,
    Box,
} from 'lucide-react';
import Swal from 'sweetalert2';

import Navbar from '../components/Navbar';
import { formatDateThai } from '../utils/utils.js';
import { getBorrowHistory } from '../services/BorrowHistory.js';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

export default function BorrowHistory() {
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [returningId, setReturningId] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const loadBorrowHistory = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getBorrowHistory();
            const list = Array.isArray(data) ? [...data] : [];

            list.sort((a, b) => {
                if (Boolean(a.Returned) !== Boolean(b.Returned)) {
                    return Number(Boolean(a.Returned)) - Number(Boolean(b.Returned));
                }

                return Number(b.BorrowID || 0) - Number(a.BorrowID || 0);
            });

            setBorrowHistory(list);
        } catch (err) {
            console.error('โหลดประวัติการยืมไม่สำเร็จ:', err);
            setError(err.message || 'ไม่สามารถโหลดประวัติการยืมได้');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBorrowHistory();
    }, [loadBorrowHistory]);

    const displayDate = (value) => {
        if (!value) return '-';

        try {
            return formatDateThai(value);
        } catch {
            return '-';
        }
    };

    const getRemaining = (item) =>
        Math.max(
            0,
            Number(item.Quantity || 0) - Number(item.ReturnedQuantity || 0)
        );

    const isFullyReturned = (item) =>
        Boolean(item.Returned) || getRemaining(item) === 0;

    const pendingCount = borrowHistory.filter(
        (item) => !isFullyReturned(item)
    ).length;

    const returnedCount = borrowHistory.filter(
        (item) => isFullyReturned(item)
    ).length;

    const filteredHistory = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return borrowHistory.filter((item) => {
            const returned =
                Boolean(item.Returned) ||
                Number(item.Quantity || 0) -
                    Number(item.ReturnedQuantity || 0) <= 0;

            const matchesFilter =
                filter === 'all' ||
                (filter === 'pending' && !returned) ||
                (filter === 'returned' && returned);

            const searchable = [
                item.BorrowID,
                item.name,
                item.names,
                item.EName,
                item.Date,
                item.ReturnDate,
            ]
                .map((value) => String(value ?? ''))
                .join(' ')
                .toLowerCase();

            return matchesFilter && (!keyword || searchable.includes(keyword));
        });
    }, [borrowHistory, search, filter]);

    const returnEquipment = async (item) => {
        const remaining = getRemaining(item);

        if (remaining <= 0) {
            await Swal.fire({
                icon: 'info',
                title: 'คืนอุปกรณ์ครบแล้ว',
                text: 'รายการนี้ไม่มีอุปกรณ์ที่ต้องคืนเพิ่มเติม',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'ระบุจำนวนที่ต้องการคืน',
            input: 'number',
            inputValue: 1,
            inputAttributes: {
                min: 1,
                max: remaining,
                step: 1,
                inputmode: 'numeric',
                'aria-label': 'จำนวนอุปกรณ์ที่ต้องการคืน',
            },
            showCancelButton: true,
            confirmButtonText: 'คืนอุปกรณ์',
            cancelButtonText: 'ยกเลิก',
            buttonsStyling: false,
            reverseButtons: true,
            focusConfirm: false,
            width: 'min(340px, calc(100vw - 32px))',
            padding: '24px 18px',
            customClass: {
                popup: '!box-border !rounded-2xl !border !border-emerald-100 !bg-white !shadow-2xl',
                title: '!mb-5 !text-lg !font-bold !text-slate-800 sm:!text-xl',
                input: '!box-border !m-0 !h-12 !w-full !rounded-lg !border-2 !border-emerald-200 !px-3 !text-base !text-slate-700 !shadow-none focus:!border-emerald-500 focus:!outline-none focus:!ring-4 focus:!ring-emerald-100',
                actions: '!mt-5 !flex !w-full !flex-row !justify-center !gap-2',
                confirmButton: '!m-0 !rounded-lg !bg-emerald-600 !px-4 !py-3 !text-sm !font-semibold !text-white hover:!bg-emerald-700',
                cancelButton: '!m-0 !rounded-lg !bg-slate-500 !px-4 !py-3 !text-sm !font-semibold !text-white hover:!bg-slate-600',
                validationMessage: '!mt-3 !rounded-lg !bg-red-50 !px-3 !py-2 !text-sm !text-red-600',
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                const input = Swal.getInput();

                if (popup) {
                    popup.style.boxSizing = 'border-box';
                    popup.style.maxWidth = 'calc(100vw - 32px)';
                    popup.style.overflow = 'hidden';
                }

                if (input) {
                    input.style.width = '100%';
                    input.style.maxWidth = '100%';
                    input.style.minWidth = '0';
                    input.style.boxSizing = 'border-box';
                }
            },
            preConfirm: (value) => {
                const quantity = Number(value);

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    quantity > remaining
                ) {
                    Swal.showValidationMessage(
                        `กรุณาระบุจำนวนเต็มระหว่าง 1 ถึง ${remaining}`
                    );
                    return false;
                }

                return quantity;
            },
        });

        if (!result.isConfirmed) return;

        setReturningId(item.BorrowID);

        try {
            const response = await fetch(
                `${API_BASE_URL}/returns/getall/create`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        BorrowID: item.BorrowID,
                        returnQuantity: result.value,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || 'คืนอุปกรณ์ไม่สำเร็จ'
                );
            }

            await Swal.fire({
                icon: 'success',
                title: 'คืนอุปกรณ์สำเร็จ',
                text: `คืนอุปกรณ์จำนวน ${result.value} ชิ้นเรียบร้อยแล้ว`,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#059669',
                timer: 1800,
                timerProgressBar: true,
            });

            await loadBorrowHistory();
        } catch (err) {
            console.error('คืนอุปกรณ์ไม่สำเร็จ:', err);

            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: err.message || 'ไม่สามารถคืนอุปกรณ์ได้',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#dc2626',
            });
        } finally {
            setReturningId(null);
        }
    };

    const renderStatus = (item) => {
        if (isFullyReturned(item)) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} />
                    คืนครบแล้ว
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                <Clock3 size={14} />
                รอคืน
            </span>
        );
    };

    const renderReturnButton = (item, fullWidth = false) => {
        if (isFullyReturned(item)) {
            return (
                <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={16} />
                    คืนครบแล้ว
                </span>
            );
        }

        return (
            <button
                type="button"
                disabled={returningId === item.BorrowID}
                onClick={() => returnEquipment(item)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-100 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                    fullWidth ? 'w-full' : ''
                }`}
            >
                <RotateCcw
                    size={16}
                    className={
                        returningId === item.BorrowID ? 'animate-spin' : ''
                    }
                />
                {returningId === item.BorrowID
                    ? 'กำลังดำเนินการ...'
                    : 'คืนอุปกรณ์'}
            </button>
        );
    };

    const filters = [
        { id: 'all', label: 'ทั้งหมด', count: borrowHistory.length },
        { id: 'pending', label: 'รอคืน', count: pendingCount },
        { id: 'returned', label: 'คืนแล้ว', count: returnedCount },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7f6] text-slate-800">
            <Navbar />

            <main className="mx-auto max-w-[1500px] space-y-6 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
                <section className="relative overflow-hidden rounded-[28px] bg-[#123f38] px-5 py-7 text-white shadow-lg shadow-emerald-950/10 sm:px-8 sm:py-9">
                    <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/[0.06]" />
                    <div className="absolute -right-4 -bottom-32 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl" />
                    <div className="absolute right-1/3 top-0 h-full w-px rotate-[25deg] bg-white/[0.06]" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f2b84b] text-[#263d32] shadow-lg shadow-black/10 sm:h-[68px] sm:w-[68px]">
                                <History size={31} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0">
                                <p className="mb-1 text-[11px] font-bold tracking-[0.2em] text-emerald-200">
                                    EQUIPMENT MANAGEMENT
                                </p>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    ประวัติการยืมอุปกรณ์
                                </h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100/75">
                                    ตรวจสอบรายการยืม ติดตามสถานะ และจัดการการคืนอุปกรณ์
                                    ได้จากที่เดียว
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-medium text-emerald-50 backdrop-blur-sm sm:self-center">
                            <span className="h-2 w-2 rounded-full bg-[#f2b84b]" />
                            ระบบจัดการอุปกรณ์
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-blue-50 transition group-hover:scale-125" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    รายการยืมทั้งหมด
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {borrowHistory.length}
                                    <span className="ml-2 text-sm font-normal text-slate-400">
                                        รายการ
                                    </span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                <Package size={23} />
                            </div>
                        </div>
                        <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-blue-50">
                            <div className="h-full w-full rounded-full bg-blue-400" />
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-orange-50 transition group-hover:scale-125" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    รายการรอคืน
                                </p>
                                <p className="mt-2 text-3xl font-bold text-orange-600">
                                    {pendingCount}
                                    <span className="ml-2 text-sm font-normal text-slate-400">
                                        รายการ
                                    </span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <Clock3 size={23} />
                            </div>
                        </div>
                        <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-orange-50">
                            <div className="h-full w-full rounded-full bg-orange-400" />
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-emerald-50 transition group-hover:scale-125" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    รายการคืนครบแล้ว
                                </p>
                                <p className="mt-2 text-3xl font-bold text-emerald-600">
                                    {returnedCount}
                                    <span className="ml-2 text-sm font-normal text-slate-400">
                                        รายการ
                                    </span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                <CheckCircle2 size={23} />
                            </div>
                        </div>
                        <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-emerald-50">
                            <div className="h-full w-full rounded-full bg-emerald-400" />
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-col gap-5 border-b border-slate-100 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f3ed] text-[#236b56]">
                                <ClipboardList size={23} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    รายการยืมอุปกรณ์
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    แสดง {filteredHistory.length} จาก {borrowHistory.length} รายการ
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-0 flex-1 sm:w-72">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="ค้นหาผู้ยืม หรือชื่ออุปกรณ์..."
                                    className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        aria-label="ล้างคำค้นหา"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={loadBorrowHistory}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cfe5da] bg-[#f1f8f4] px-4 py-3 text-sm font-semibold text-[#28664f] transition hover:bg-[#e5f3eb] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? 'animate-spin' : ''}
                                />
                                รีเฟรชข้อมูล
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs font-medium text-slate-400">
                            กรองรายการตามสถานะการคืน
                        </p>

                        <div className="flex w-full gap-2 sm:w-auto">
                            {filters.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setFilter(item.id)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:flex-none ${
                                        filter === item.id
                                            ? 'bg-[#174d40] text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                                            filter === item.id
                                                ? 'bg-white/15 text-white'
                                                : 'bg-white text-slate-500'
                                        }`}
                                    >
                                        {item.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="m-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:m-6">
                            <AlertCircle size={20} className="shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">
                                    ไม่สามารถโหลดประวัติการยืมได้
                                </p>
                                <p className="mt-1 break-words">{error}</p>
                                <button
                                    type="button"
                                    onClick={loadBorrowHistory}
                                    className="mt-2 font-semibold underline underline-offset-2"
                                >
                                    ลองอีกครั้ง
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && borrowHistory.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <RefreshCw size={26} className="animate-spin" />
                            </div>
                            <span className="text-sm">กำลังโหลดข้อมูล...</span>
                        </div>
                    )}

                    {!loading && !error && filteredHistory.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#f0f5f2] text-slate-400">
                                <Box size={34} strokeWidth={1.5} />
                            </div>
                            <h3 className="mt-5 font-bold text-slate-700">
                                {search || filter !== 'all'
                                    ? 'ไม่พบรายการที่ตรงกัน'
                                    : 'ยังไม่มีประวัติการยืม'}
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                                {search || filter !== 'all'
                                    ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรองอีกครั้ง'
                                    : 'เมื่อมีการยืมอุปกรณ์ รายการจะแสดงที่นี่'}
                            </p>
                            {(search || filter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setFilter('all');
                                    }}
                                    className="mt-5 rounded-xl bg-[#174d40] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#236b56]"
                                >
                                    ล้างตัวกรอง
                                </button>
                            )}
                        </div>
                    )}

                    {!error && filteredHistory.length > 0 && (
                        <div className="space-y-3 bg-[#f8faf9] p-3 md:hidden">
                            {filteredHistory.map((item, index) => (
                                <article
                                    key={item.BorrowID ?? index}
                                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-emerald-200"
                                >
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4ee] text-xs font-bold text-[#28664f]">
                                                {borrowHistory.indexOf(item) + 1}
                                            </span>
                                            <div>
                                                <p className="text-[10px] text-slate-400">
                                                    รหัสรายการ
                                                </p>
                                                <p className="text-xs font-bold text-slate-700">
                                                    #{item.BorrowID ?? '-'}
                                                </p>
                                            </div>
                                        </div>
                                        {renderStatus(item)}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-medium text-slate-400">
                                                    ชื่ออุปกรณ์
                                                </p>
                                                <h3 className="mt-1 break-words text-base font-bold text-slate-800">
                                                    {item.EName || 'ไม่ระบุชื่ออุปกรณ์'}
                                                </h3>
                                            </div>

                                            <div className="shrink-0 rounded-xl bg-[#edf6f0] px-3 py-2 text-center">
                                                <Package size={17} className="mx-auto text-[#347b5d]" />
                                                <p className="mt-1 text-sm font-bold text-[#28664f]">
                                                    {item.Quantity ?? 0}
                                                </p>
                                                <p className="text-[9px] text-slate-400">
                                                    จำนวนยืม
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#f7f9f8] p-3">
                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <UserRound size={12} />
                                                    ผู้ยืม
                                                </p>
                                                <p className="mt-1 break-words text-xs font-semibold text-slate-700">
                                                    {item.names || '-'}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <Wrench size={12} />
                                                    ผู้ดำเนินการ
                                                </p>
                                                <p className="mt-1 break-words text-xs font-semibold text-slate-700">
                                                    {item.name || '-'}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <CalendarDays size={12} />
                                                    วันที่ยืม
                                                </p>
                                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                                    {displayDate(item.Date)}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <CalendarDays size={12} />
                                                    วันที่คืน
                                                </p>
                                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                                    {displayDate(item.ReturnDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] text-slate-400">
                                                    จำนวนที่ยังไม่คืน
                                                </p>
                                                <p className="mt-0.5 text-sm font-bold text-slate-700">
                                                    {getRemaining(item)} ชิ้น
                                                </p>
                                            </div>
                                            {renderReturnButton(item)}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!error && filteredHistory.length > 0 && (
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[1100px] text-sm">
                                <thead className="bg-[#f1f7f3]">
                                    <tr>
                                        {[
                                            'ลำดับ',
                                            'ผู้ดำเนินการ',
                                            'ชื่อผู้ยืม',
                                            'ชื่ออุปกรณ์',
                                            'จำนวน',
                                            'วันที่ยืม',
                                            'วันที่คืน',
                                            'สถานะ',
                                            'ดำเนินการ',
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="whitespace-nowrap border-b border-[#e1ece5] px-4 py-4 text-center text-xs font-bold text-[#426456]"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredHistory.map((item, index) => (
                                        <tr
                                            key={item.BorrowID ?? index}
                                            className="transition-colors hover:bg-[#f7fbf8]"
                                        >
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                                                    {borrowHistory.indexOf(item) + 1}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-600">
                                                {item.name || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center font-medium text-slate-700">
                                                {item.names || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <div className="mx-auto flex max-w-[220px] items-center justify-center gap-2">
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf4ee] text-[#347b5d]">
                                                        <Package size={16} />
                                                    </span>
                                                    <span className="break-words text-left font-semibold text-slate-800">
                                                        {item.EName || '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700">
                                                    {item.Quantity ?? 0}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-500">
                                                {displayDate(item.Date)}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-500">
                                                {displayDate(item.ReturnDate)}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                {renderStatus(item)}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                                {renderReturnButton(item)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && !error && filteredHistory.length > 0 && (
                        <div className="flex flex-col gap-2 border-t border-slate-100 bg-white px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <span>
                                แสดง {filteredHistory.length} จาก {borrowHistory.length} รายการ
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ArrowUpRight size={14} />
                                ระบบจัดการยืมและคืนอุปกรณ์
                            </span>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}