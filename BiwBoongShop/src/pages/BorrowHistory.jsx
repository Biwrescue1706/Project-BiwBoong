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
                    return Number(Boolean(a.Returned)) -
                        Number(Boolean(b.Returned));
                }

                return Number(b.BorrowID || 0) -
                    Number(a.BorrowID || 0);
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
            Number(item.Quantity || 0) -
            Number(item.ReturnedQuantity || 0)
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
            const returned = Boolean(item.Returned) ||
                (
                    Number(item.Quantity || 0) -
                    Number(item.ReturnedQuantity || 0)
                ) <= 0;

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

            return matchesFilter &&
                (!keyword || searchable.includes(keyword));
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
            confirmButtonText: '↶ คืนอุปกรณ์',
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
                    data.message ||
                    data.error ||
                    'คืนอุปกรณ์ไม่สำเร็จ'
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
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <CheckCircle2 size={14} />
                    คืนแล้ว
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                <Clock3 size={14} />
                รอคืน
            </span>
        );

    };

    const renderReturnButton = (item, fullWidth = false) => {
        if (isFullyReturned(item)) {
            return (
                <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
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
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-100 transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? 'w-full' : ''
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

    return (
        <div className="min-h-screen bg-[#f3faf7] text-slate-800">
            <Navbar />

            <main className="mx-auto max-w-[1600px] space-y-5 px-3 py-5 sm:px-6 lg:px-8">
                {/* Page heading */}
                <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-emerald-50" />
                    <div className="absolute -right-2 -top-16 h-36 w-36 rounded-full border-[18px] border-emerald-50/70" />

                    <div className="relative flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-100 sm:h-16 sm:w-16">
                            <History size={29} />
                        </div>

                        <div className="min-w-0">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                EQUIPMENT MANAGEMENT
                            </p>
                            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                                ประวัติการยืมอุปกรณ์
                            </h1>
                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                ตรวจสอบรายการยืม ติดตามสถานะ และจัดการการคืนอุปกรณ์
                            </p>
                        </div>
                    </div>
                </section>

                {/* Summary cards */}
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-slate-500">
                                    รายการยืมทั้งหมด
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-800">
                                    {borrowHistory.length}
                                    <span className="ml-1 text-sm font-normal text-slate-400">
                                        รายการ
                                    </span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Package size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-slate-500">
                                    รายการรอคืน
                                </p>
                                <p className="mt-2 text-2xl font-bold text-amber-600">
                                    {pendingCount}
                                    <span className="ml-1 text-sm font-normal text-slate-400">
                                        รายการ
                                    </span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Clock3 size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-slate-500">
                                    รายการคืนครบแล้ว
                                </p>
                                <p className="mt-2 text-2xl font-bold text-emerald-600">
                                    {returnedCount}
                                    <span className="ml-1 text-sm font-normal text-slate-400">
                                        รายการ
                                    </span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={23} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* History panel */}
                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ClipboardList size={22} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">
                                    รายการยืมอุปกรณ์
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    พบ {filteredHistory.length} จาก {borrowHistory.length} รายการ
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-0 flex-1 lg:w-64">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="ค้นหาผู้ยืม อุปกรณ์..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        aria-label="ล้างคำค้นหา"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={loadBorrowHistory}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? 'animate-spin' : ''}
                                />
                                รีเฟรช
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 lg:hidden">
                            {[
                                { id: 'all', label: 'ทั้งหมด' },
                                { id: 'pending', label: 'รอคืน' },
                                { id: 'returned', label: 'คืนแล้ว' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setFilter(item.id)}
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === item.id
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop filters */}
                    <div className="hidden items-center justify-between border-b border-slate-100 px-5 py-3 lg:flex">
                        <p className="text-xs text-slate-400">
                            เลือกดูรายการตามสถานะ
                        </p>

                        <div className="flex gap-2">
                            {[
                                { id: 'all', label: 'ทั้งหมด' },
                                { id: 'pending', label: 'รอคืน' },
                                { id: 'returned', label: 'คืนแล้ว' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setFilter(item.id)}
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === item.id
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="m-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                            <AlertCircle size={20} className="shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">
                                    ไม่สามารถโหลดประวัติการยืมได้
                                </p>
                                <p className="mt-1 break-words">{error}</p>
                                <button
                                    type="button"
                                    onClick={loadBorrowHistory}
                                    className="mt-2 font-semibold underline"
                                >
                                    ลองอีกครั้ง
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && borrowHistory.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                            <RefreshCw
                                size={30}
                                className="animate-spin text-emerald-600"
                            />
                            <span className="text-sm">กำลังโหลดข้อมูล...</span>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && filteredHistory.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <ClipboardList size={30} />
                            </div>
                            <h3 className="mt-4 font-semibold text-slate-700">
                                {search || filter !== 'all'
                                    ? 'ไม่พบรายการที่ตรงกัน'
                                    : 'ยังไม่มีประวัติการยืม'}
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                                {search || filter !== 'all'
                                    ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง'
                                    : 'รายการยืมอุปกรณ์จะแสดงที่นี่'}
                            </p>
                            {(search || filter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setFilter('all');
                                    }}
                                    className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                                >
                                    ล้างตัวกรอง
                                </button>
                            )}
                        </div>
                    )}

                    {/* Mobile cards */}
                    {!error && filteredHistory.length > 0 && (
                        <div className="space-y-3 bg-slate-50/50 p-3 md:hidden">
                            {filteredHistory.map((item, index) => (
                                <article
                                    key={item.BorrowID ?? index}
                                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:border-emerald-200"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[11px] font-medium text-slate-400">
                                                    ลำดับ {borrowHistory.indexOf(item) + 1}
                                                    {' · '}
                                                    รหัสรายการ {item.BorrowID ?? '-'}
                                                </p>
                                                <h3 className="mt-1 break-words font-bold text-slate-800">
                                                    {item.EName || 'ไม่ระบุชื่ออุปกรณ์'}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    ผู้ยืม: {item.names || '-'}
                                                </p>
                                            </div>

                                            <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                                                <Package size={15} />
                                                {item.Quantity ?? 0}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <UserRound size={12} />
                                                    ผู้ดำเนินการ
                                                </p>
                                                <p className="mt-1 break-words text-xs font-medium text-slate-700">
                                                    {item.name || '-'}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <Wrench size={12} />
                                                    จำนวนคงเหลือ
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-700">
                                                    {getRemaining(item)} ชิ้น
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <CalendarDays size={12} />
                                                    วันที่ยืม
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-700">
                                                    {displayDate(item.Date)}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <CalendarDays size={12} />
                                                    วันที่คืน
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-700">
                                                    {displayDate(item.ReturnDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            {renderStatus(item)}
                                            {renderReturnButton(item)}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Tablet and desktop table */}
                    {!error && filteredHistory.length > 0 && (
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[1050px] text-sm">
                                <thead className="bg-emerald-50/80 text-slate-600">
                                    <tr>
                                        {[
                                            'ลำดับ',
                                            'ชื่อคนดำเนินการ',
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
                                                className="whitespace-nowrap border-b border-emerald-100 px-4 py-4 text-center text-xs font-bold"
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
                                            className="transition-colors hover:bg-emerald-50/40"
                                        >
                                            <td className="px-4 py-4 text-center text-slate-400">
                                                {borrowHistory.indexOf(item) + 1}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-700">
                                                {item.name || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-700">
                                                {item.names || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-center font-semibold text-slate-800">
                                                {item.EName || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex min-w-10 items-center justify-center rounded-xl bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700">
                                                    {item.Quantity ?? 0}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-600">
                                                {displayDate(item.Date)}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-center text-slate-600">
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
                        <div className="flex flex-col gap-1 border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <span>
                                แสดง {filteredHistory.length} จาก {borrowHistory.length} รายการ
                            </span>
                            <span>ระบบจัดการยืมและคืนอุปกรณ์</span>
                        </div>
                    )}
                </section>
            </main>
        </div>

    );
}