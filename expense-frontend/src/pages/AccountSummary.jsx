import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { errorAlert } from "../utils/alert";
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaMoneyBillWave,
    FaChartPie,
    FaCalendarAlt,
} from "react-icons/fa";

function AccountSummary() {
    const currentDate = new Date();

    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDay, setSelectedDay] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(
        currentDate.getFullYear()
    );
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const thaiMonthNames = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
    ];

    const monthNames = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ];

    const today = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [transactionRes, accountRes] = await Promise.all([
                api.get("/transactions"),
                api.get("/accounts"),
            ]);

            const transactionResponse = transactionRes.data;
            const accountResponse = accountRes.data;

            const transactionData =
                transactionResponse?.data?.transactions ||
                transactionResponse?.data ||
                transactionResponse?.transactions ||
                [];

            const accountData =
                accountResponse?.data?.accounts ||
                accountResponse?.data ||
                accountResponse?.accounts ||
                [];

            setTransactions(
                Array.isArray(transactionData) ? transactionData : []
            );

            setAccounts(
                Array.isArray(accountData) ? accountData : []
            );
        } catch (err) {
            errorAlert(
                err.response?.data?.message ||
                "ไม่สามารถโหลดข้อมูลได้"
            );
        } finally {
            setLoading(false);
        }
    };

    const isUUID = (value) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            String(value || "").trim()
        );
    };

    const years = useMemo(() => {
        const yearSet = new Set();

        transactions.forEach((item) => {
            if (!item.date) return;

            const year = Number(
                String(item.date).substring(0, 10).split("-")[0]
            );

            if (!isNaN(year)) {
                yearSet.add(year);
            }
        });

        yearSet.add(currentDate.getFullYear());

        return Array.from(yearSet).sort((a, b) => b - a);
    }, [transactions]);

    const availableMonths = useMemo(() => {
        const monthSet = new Set();

        transactions.forEach((item) => {
            if (!item.date) return;

            const [year, month] = String(item.date)
                .substring(0, 10)
                .split("-")
                .map(Number);

            if (
                year === Number(selectedYear) &&
                month >= 1 &&
                month <= 12
            ) {
                monthSet.add(month);
            }
        });

        return Array.from(monthSet).sort((a, b) => a - b);
    }, [transactions, selectedYear]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((item) => {
            if (!item.date) return false;

            const itemDate = String(item.date).substring(0, 10);
            const [year, month, day] = itemDate.split("-").map(Number);

            if (selectedDay === "range") {
                if (
                    startDate &&
                    endDate &&
                    (itemDate < startDate || itemDate > endDate)
                ) {
                    return false;
                }

                if (
                    startDate &&
                    !endDate &&
                    itemDate < startDate
                ) {
                    return false;
                }

                if (
                    endDate &&
                    !startDate &&
                    itemDate > endDate
                ) {
                    return false;
                }

                return true;
            }

            if (
                selectedDay === "today" &&
                itemDate !== today
            ) {
                return false;
            }

            if (
                selectedDay !== "today" &&
                selectedDay !== "all" &&
                day !== Number(selectedDay)
            ) {
                return false;
            }

            if (
                selectedMonth !== "all" &&
                month !== Number(selectedMonth)
            ) {
                return false;
            }

            if (
                selectedDay !== "range" &&
                year !== Number(selectedYear)
            ) {
                return false;
            }

            return true;
        });
    }, [
        transactions,
        selectedDay,
        selectedMonth,
        selectedYear,
        startDate,
        endDate,
        today,
    ]);

    const accountSummary = useMemo(() => {
        const accountMap = new Map();

        accounts.forEach((account) => {
            const id = String(account.id || "").trim();
            const name = String(account.name || "").trim();

            if (!id || !name || isUUID(name)) {
                return;
            }

            const key = name.toLowerCase();

            if (!accountMap.has(key)) {
                accountMap.set(key, {
                    id,
                    name,
                    accountIds: [id],
                    income: 0,
                    expense: 0,
                });
            } else {
                const existing = accountMap.get(key);

                if (!existing.accountIds.includes(id)) {
                    existing.accountIds.push(id);
                }
            }
        });

        accountMap.forEach((account) => {
            const accountTransactions = filteredTransactions.filter(
                (transaction) => {
                    const transactionAccountId = String(
                        transaction.accountTypesId || ""
                    ).trim();

                    return account.accountIds.includes(
                        transactionAccountId
                    );
                }
            );

            account.income = accountTransactions.reduce(
                (sum, transaction) =>
                    sum + Number(transaction.income || 0),
                0
            );

            account.expense = accountTransactions.reduce(
                (sum, transaction) =>
                    sum + Number(transaction.expense || 0),
                0
            );

            account.balance =
                account.income - account.expense;
        });

        return Array.from(accountMap.values());
    }, [accounts, filteredTransactions]);

    const total = useMemo(() => {
        return accountSummary.reduce(
            (result, account) => {
                result.income += Number(account.income || 0);
                result.expense += Number(account.expense || 0);
                result.balance += Number(account.balance || 0);

                return result;
            },
            {
                income: 0,
                expense: 0,
                balance: 0,
            }
        );
    }, [accountSummary]);

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString("th-TH", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const parts = String(date)
            .substring(0, 10)
            .split("-");

        if (parts.length !== 3) {
            return date;
        }

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return `${day} ${
            thaiMonthNames[month - 1]
        } ${year + 543}`;
    };

    const selectedDateText = useMemo(() => {
        if (selectedDay === "today") {
            return `วันนี้ ${formatDate(today)}`;
        }

        if (selectedDay === "range") {
            if (startDate && endDate) {
                return `${formatDate(startDate)} - ${formatDate(endDate)}`;
            }

            if (startDate) {
                return `ตั้งแต่ ${formatDate(startDate)}`;
            }

            if (endDate) {
                return `ถึง ${formatDate(endDate)}`;
            }

            return "ระหว่างวันที่";
        }

        let text =
            selectedDay === "all"
                ? "ทุกวัน"
                : `วันที่ ${selectedDay}`;

        text +=
            selectedMonth === "all"
                ? " • ทุกเดือน"
                : ` • ${monthNames[Number(selectedMonth) - 1]}`;

        text += ` • พ.ศ. ${Number(selectedYear) + 543}`;

        return text;
    }, [
        selectedDay,
        selectedMonth,
        selectedYear,
        startDate,
        endDate,
        today,
    ]);

    const handleDayChange = (value) => {
        setSelectedDay(value);

        if (value === "today") {
            setSelectedYear(currentDate.getFullYear());
            setSelectedMonth(currentDate.getMonth() + 1);
            setStartDate(today);
            setEndDate(today);
        }

        if (value !== "range" && value !== "today") {
            setStartDate("");
            setEndDate("");
        }
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
        setSelectedDay("all");
        setStartDate("");
        setEndDate("");
    };

    const handleYearChange = (value) => {
        setSelectedYear(Number(value));
        setSelectedMonth("all");
        setSelectedDay("all");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="min-h-full space-y-5 bg-slate-50/50 pb-8">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-lg sm:p-6 md:p-7">
                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                                <FaChartPie />
                            </div>

                            <span className="text-sm font-medium text-blue-50">
                                Account Summary
                            </span>
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                            สรุปตามช่องทางบัญชี
                        </h1>

                        <p className="mt-1 text-sm text-blue-50 sm:text-base">
                            รายรับ รายจ่าย และยอดคงเหลือแยกตามช่องทาง
                        </p>
                    </div>

                    <div className="w-full lg:w-auto">
                        <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-md">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <select
                                    value={selectedDay}
                                    onChange={(e) =>
                                        handleDayChange(e.target.value)
                                    }
                                    className="h-11 w-full rounded-xl bg-white px-4 text-sm font-semibold text-gray-800 outline-none"
                                >
                                    <option value="all">
                                        วัน: ทั้งหมด
                                    </option>

                                    <option value="today">
                                        วันนี้
                                    </option>

                                    <option value="range">
                                        ระหว่างวัน
                                    </option>

                                    {Array.from(
                                        { length: 31 },
                                        (_, i) => i + 1
                                    ).map((day) => (
                                        <option key={day} value={day}>
                                            วันที่ {day}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        handleMonthChange(e.target.value)
                                    }
                                    className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-gray-800 outline-none"
                                >
                                    <option value="all">
                                        เดือน: ทั้งหมด
                                    </option>

                                    {availableMonths.map((month) => (
                                        <option
                                            key={month}
                                            value={month}
                                        >
                                            {monthNames[month - 1]}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedYear}
                                    onChange={(e) =>
                                        handleYearChange(e.target.value)
                                    }
                                    className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-gray-800 outline-none"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            พ.ศ. {year + 543}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedDay === "range" && (
                                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="relative">
                                        <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                            className="h-11 w-full rounded-xl bg-white pl-10 pr-3 text-sm font-semibold text-gray-800 outline-none"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                            className="h-11 w-full rounded-xl bg-white pl-10 pr-3 text-sm font-semibold text-gray-800 outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-indigo-600" />

                    <span className="font-semibold text-slate-700">
                        ช่วงที่เลือก:
                    </span>

                    <span className="rounded-lg bg-indigo-50 px-3 py-1 font-medium text-indigo-700">
                        {selectedDateText}
                    </span>

                    <span className="text-slate-400">
                        •
                    </span>

                    <span className="text-slate-500">
                        {filteredTransactions.length.toLocaleString(
                            "th-TH"
                        )}{" "}
                        รายการ
                    </span>
                </div>
            </div>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">
                                รายรับรวม
                            </p>

                            <p className="mt-2 text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                                {formatMoney(total.income)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                บาท
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-600">
                            <FaArrowUp />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">
                                รายจ่ายรวม
                            </p>

                            <p className="mt-2 text-2xl font-extrabold text-red-600 sm:text-3xl">
                                {formatMoney(total.expense)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                บาท
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">
                            <FaArrowDown />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">
                                คงเหลือสุทธิ
                            </p>

                            <p
                                className={`mt-2 text-2xl font-extrabold sm:text-3xl ${
                                    total.balance >= 0
                                        ? "text-blue-600"
                                        : "text-red-600"
                                }`}
                            >
                                {formatMoney(total.balance)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                บาท
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                            <FaMoneyBillWave />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
                            <FaWallet className="text-indigo-600" />
                            บัญชีทั้งหมด
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            แยกรายรับ รายจ่าย และยอดคงเหลือตามช่องทาง
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                        {accountSummary.length} บัญชี
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                        <p className="text-sm font-medium text-slate-500">
                            กำลังโหลดข้อมูล...
                        </p>
                    </div>
                ) : accountSummary.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <FaWallet className="mx-auto text-4xl text-slate-300" />

                        <p className="mt-3 text-lg font-bold text-slate-600">
                            ยังไม่มีข้อมูลบัญชี
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            เพิ่มบัญชีเพื่อดูสรุปยอดตามช่องทาง
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {accountSummary.map((account) => (
                            <div
                                key={account.name}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg text-indigo-600">
                                            <FaWallet />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="break-words whitespace-normal text-lg font-extrabold leading-snug text-slate-800">
                                                {account.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-400">
                                                รายการในช่วงที่เลือก
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 divide-y divide-slate-100">
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                <FaArrowUp />
                                            </div>

                                            <span className="text-sm font-semibold text-slate-600">
                                                รายรับ
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-base font-extrabold text-emerald-600">
                                            {formatMoney(account.income)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                                <FaArrowDown />
                                            </div>

                                            <span className="text-sm font-semibold text-slate-600">
                                                รายจ่าย
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-base font-extrabold text-red-600">
                                            {formatMoney(account.expense)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 bg-slate-50/70 px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <FaMoneyBillWave />
                                            </div>

                                            <span className="text-sm font-bold text-slate-700">
                                                คงเหลือ
                                            </span>
                                        </div>

                                        <span
                                            className={`shrink-0 text-lg font-extrabold ${
                                                account.balance >= 0
                                                    ? "text-blue-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {formatMoney(account.balance)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default AccountSummary;