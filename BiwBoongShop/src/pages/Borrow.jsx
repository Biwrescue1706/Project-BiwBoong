
import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
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

        return equipments.filter((item) =>
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
          <label for="borrower-name"
            style="display:block;margin-bottom:6px;font-size:14px">
            ชื่อผู้ยืม
          </label>
          <input
            id="borrower-name"
            class="swal2-input"
            style="width:100%;margin:0 0 14px"
            placeholder="ชื่อผู้ยืม"
            autocomplete="name"
          />

          <label for="borrower-quantity"
            style="display:block;margin-bottom:6px;font-size:14px">
            จำนวนที่ต้องการยืม
          </label>
          <input
            id="borrower-quantity"
            class="swal2-input"
            style="width:100%;margin:0"
            type="number"
            min="1"
            max="${available}"
            step="1"
            value="1"
          />

          <p style="margin-top:8px;font-size:12px;color:#64748b">
            คงเหลือ ${available} ชิ้น
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
            });
        } finally {
            setSubmittingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:pt-24">
                <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <button
                                type="button"
                                onClick={() => window.location.assign('/dashboard')}
                                className="transition hover:text-emerald-700"
                            >
                                หน้าหลัก
                            </button>
                            <span aria-hidden="true">›</span>
                            <span className="font-semibold text-emerald-700">
                                ยืมอุปกรณ์
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 sm:h-14 sm:w-14">
                                <span className="text-2xl" aria-hidden="true">↗</span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                    ยืมอุปกรณ์
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    เลือกรายการอุปกรณ์ที่ต้องการยืม
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <span className="text-xl" aria-hidden="true">▦</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">อุปกรณ์พร้อมให้ยืม</p>
                            <p className="text-sm font-bold text-slate-800">
                                {totalAvailable.toLocaleString('th-TH')} ชิ้น
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div className="flex items-start gap-3 p-4 sm:items-center sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <span className="text-xl" aria-hidden="true">i</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-emerald-950">
                                วิธีการยืมอุปกรณ์
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">
                                เลือกอุปกรณ์ที่มีจำนวนคงเหลือ กดปุ่มยืม
                                กรอกชื่อผู้ยืมและจำนวนที่ต้องการ
                                แล้วกดยืนยันเพื่อทำรายการ
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-slate-500 sm:text-sm">
                            รายการอุปกรณ์
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-800">
                            {equipments.length.toLocaleString('th-TH')}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">รายการ</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs text-slate-500 sm:text-sm">
                            จำนวนทั้งหมด
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-800">
                            {totalEquipment.toLocaleString('th-TH')}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">ชิ้น</p>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:col-span-1">
                        <p className="text-xs text-slate-500 sm:text-sm">
                            จำนวนคงเหลือ
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                            {totalAvailable.toLocaleString('th-TH')}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">ชิ้น</p>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                รายการอุปกรณ์ทั้งหมด
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                ตรวจสอบจำนวนคงเหลือก่อนทำรายการ
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-xs">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                ⌕
                            </span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="ค้นหาชื่ออุปกรณ์..."
                                aria-label="ค้นหาชื่ออุปกรณ์"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:m-6">
                            <p>{error}</p>
                            <button
                                type="button"
                                onClick={() => loadEquipments()}
                                className="mt-2 font-semibold underline"
                            >
                                ลองโหลดข้อมูลอีกครั้ง
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center gap-3 px-4 py-16 text-slate-400">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                            <span className="text-sm">กำลังโหลดข้อมูลอุปกรณ์...</span>
                        </div>
                    ) : filteredEquipments.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-4 py-16 text-slate-400">
                            <span className="text-4xl" aria-hidden="true">▦</span>
                            <p className="text-sm">
                                {search
                                    ? 'ไม่พบอุปกรณ์ที่ค้นหา'
                                    : 'ไม่มีข้อมูลอุปกรณ์'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* การ์ดสำหรับมือถือและแท็บเล็ต */}
                            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:hidden">
                                {filteredEquipments.map((item, index) => {
                                    const available = Math.max(
                                        0,
                                        Number(item.Available ?? 0)
                                    );
                                    const total = Math.max(0, Number(item.Total ?? 0));
                                    const isSubmitting = submittingId === Number(item.EID);

                                    return (
                                        <article
                                            key={item.EID ?? `${item.EName}-${index}`}
                                            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-3 p-4">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${available > 0
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-400'
                                                        }`}
                                                >
                                                    <span className="text-xl" aria-hidden="true">▦</span>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="mb-1 text-xs text-slate-400">
                                                        รายการที่ {(index + 1).toLocaleString('th-TH')}
                                                    </p>
                                                    <h3 className="break-words font-bold leading-relaxed text-slate-800">
                                                        {item.EName ?? '-'}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                                                <div className="rounded-xl bg-slate-50 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        จำนวนทั้งหมด
                                                    </p>
                                                    <p className="mt-1 text-xl font-extrabold text-slate-700">
                                                        {total.toLocaleString('th-TH')}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-3">
                                                    <p className="text-xs text-slate-500">
                                                        จำนวนคงเหลือ
                                                    </p>
                                                    <p className={`mt-1 text-xl font-extrabold ${available > 0 ? 'text-emerald-700' : 'text-red-600'
                                                        }`}>
                                                        {available.toLocaleString('th-TH')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-auto border-t border-slate-100 bg-slate-50/70 p-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleBorrow(item)}
                                                    disabled={available <= 0 || submittingId !== null}
                                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${available > 0
                                                        ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98]'
                                                        : 'cursor-not-allowed bg-slate-200 text-slate-400'
                                                        } disabled:cursor-not-allowed disabled:opacity-60`}
                                                >
                                                    {isSubmitting
                                                        ? 'กำลังดำเนินการ...'
                                                        : available > 0
                                                            ? '↗ ยืมอุปกรณ์'
                                                            : 'อุปกรณ์หมด'}
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* ตารางสำหรับหน้าจอขนาด 1280px ขึ้นไป */}
                            <div className="hidden overflow-x-auto xl:block">
                                <table className="w-full min-w-[760px] border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs tracking-wide text-slate-500">
                                            <th className="w-20 border-b border-slate-200 px-5 py-4 text-center font-bold">
                                                ลำดับ
                                            </th>
                                            <th className="border-b border-slate-200 px-5 py-4 text-left font-bold">
                                                ชื่ออุปกรณ์
                                            </th>
                                            <th className="w-36 border-b border-slate-200 px-5 py-4 text-center font-bold">
                                                จำนวนทั้งหมด
                                            </th>
                                            <th className="w-36 border-b border-slate-200 px-5 py-4 text-center font-bold">
                                                คงเหลือ
                                            </th>
                                            <th className="w-40 border-b border-slate-200 px-5 py-4 text-center font-bold">
                                                ดำเนินการ
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredEquipments.map((item, index) => {
                                            const available = Math.max(
                                                0,
                                                Number(item.Available ?? 0)
                                            );
                                            const total = Math.max(0, Number(item.Total ?? 0));
                                            const isSubmitting = submittingId === Number(item.EID);

                                            return (
                                                <tr
                                                    key={item.EID ?? `${item.EName}-${index}`}
                                                    className="transition-colors hover:bg-emerald-50/60"
                                                >
                                                    <td className="border-b border-slate-100 px-5 py-4 text-center text-slate-400">
                                                        {(index + 1).toLocaleString('th-TH')}
                                                    </td>

                                                    <td className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-700">
                                                        {item.EName ?? '-'}
                                                    </td>

                                                    <td className="border-b border-slate-100 px-5 py-4 text-center text-slate-600">
                                                        {total.toLocaleString('th-TH')}
                                                    </td>

                                                    <td className="border-b border-slate-100 px-5 py-4 text-center">
                                                        <span className={`inline-flex min-w-12 items-center justify-center rounded-full px-3 py-1 text-sm font-bold ${available > 0
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-red-100 text-red-600'
                                                            }`}>
                                                            {available.toLocaleString('th-TH')}
                                                        </span>
                                                    </td>

                                                    <td className="border-b border-slate-100 px-5 py-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleBorrow(item)}
                                                            disabled={available <= 0 || submittingId !== null}
                                                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${available > 0
                                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                                : 'cursor-not-allowed bg-slate-100 text-slate-400'
                                                                } disabled:opacity-60`}
                                                        >
                                                            {isSubmitting
                                                                ? 'กำลังดำเนินการ...'
                                                                : available > 0
                                                                    ? '↗ ยืม'
                                                                    : 'อุปกรณ์หมด'}
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

                    <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
                        <p className="text-xs leading-relaxed text-slate-500">
                            กรุณาตรวจสอบชื่ออุปกรณ์และจำนวนก่อนยืนยันการยืม
                            หากอุปกรณ์หมดจะไม่สามารถทำรายการได้
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
