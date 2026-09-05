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
    ).padStart(2, "0")}-${String(
        currentDate.getDate()
    ).padStart(2, "0")}`;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [transactionRes, accountRes] =
                await Promise.all([
                    api.get("/transactions"),
                    api.get("/accounts"),
                ]);

            const transactionResponse =
                transactionRes.data;

            const transactionData =
                transactionResponse.data?.transactions ||
                transactionResponse.data ||
                transactionResponse.transactions ||
                [];

            const accountResponse =
                accountRes.data;

            const accountData =
                accountResponse.data?.accounts ||
                accountResponse.data ||
                accountResponse.accounts ||
                [];

            setTransactions(
                Array.isArray(transactionData)
                    ? transactionData
                    : []
            );

            setAccounts(
                Array.isArray(accountData)
                    ? accountData
                    : []
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

    const years = useMemo(() => {
        const yearSet = new Set();

        transactions.forEach((item) => {
            if (!item.date) return;

            const year = Number(
                String(item.date)
                    .substring(0, 10)
                    .split("-")[0]
            );

            if (!isNaN(year)) {
                yearSet.add(year);
            }
        });

        yearSet.add(currentDate.getFullYear());

        return Array.from(yearSet).sort(
            (a, b) => b - a
        );
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

        return Array.from(monthSet).sort(
            (a, b) => a - b
        );
    }, [transactions, selectedYear]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((item) => {
            if (!item.date) return false;

            const itemDate = String(item.date).substring(
                0,
                10
            );

            const [year, month, day] =
                itemDate.split("-").map(Number);

            if (selectedDay === "range") {
                if (
                    startDate &&
                    endDate &&
                    (itemDate < startDate ||
                        itemDate > endDate)
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
        const map = new Map();

        accounts.forEach((account) => {
            const name = String(account.name || "ไม่ระบุช่องทาง").trim();

            if (!map.has(name)) {
                map.set(name, {
                    name,
                    balance: 0,
                    income: 0,
                    expense: 0,
                });
            }

            const item = map.get(name);
            item.balance += Number(account.balance || 0);
        });

        filteredTransactions.forEach((transaction) => {
            const name = String(
                transaction.accountTypeName || "ไม่ระบุช่องทาง"
            ).trim();

            if (!map.has(name)) {
                map.set(name, {
                    name,
                    balance: 0,
                    income: 0,
                    expense: 0,
                });
            }

            const item = map.get(name);

            item.income += Number(transaction.income || 0);
            item.expense += Number(transaction.expense || 0);
        });

        return Array.from(map.values());
    }, [accounts, filteredTransactions]);

    const total = useMemo(() => {
        return accountSummary.reduce(
            (result, account) => {
                result.income += account.income;
                result.expense += account.expense;
                result.balance += account.balance;
                return result;
            },
            {
                income: 0,
                expense: 0,
                balance: 0,
            }
        );
    }, [accountSummary]);

    const formatMoney = (value) =>
        Number(value || 0).toLocaleString(
            "th-TH"
        );

    const formatDate = (date) => {
        if (!date) return "-";

        const parts = String(date)
            .substring(0, 10)
            .split("-");

        if (parts.length !== 3) return date;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return `${day} ${thaiMonthNames[month - 1]
            } ${year + 543}`;
    };

    const selectedDateText = useMemo(() => {
        if (selectedDay === "today") {
            return `วันนี้ ${formatDate(today)}`;
        }

        if (selectedDay === "range") {
            if (startDate && endDate) {
                return `${formatDate(
                    startDate
                )} - ${formatDate(endDate)}`;
            }

            if (startDate) {
                return `ตั้งแต่ ${formatDate(
                    startDate
                )}`;
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
                : ` • ${monthNames[
                Number(selectedMonth) - 1
                ]
                }`;

        text += ` • พ.ศ. ${Number(selectedYear) + 543
            }`;

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
            setSelectedYear(
                currentDate.getFullYear()
            );
            setSelectedMonth(
                currentDate.getMonth() + 1
            );
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
                                <div className="relative">
                                    <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-gray-700" />

                                    <select
                                        value={selectedDay}
                                        onChange={(e) =>
                                            handleDayChange(
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl bg-white pl-9 pr-4 text-sm font-semibold text-gray-800 outline-none"
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
                                            <option
                                                key={day}
                                                value={day}
                                            >
                                                วันที่ {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <select
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        handleMonthChange(
                                            e.target.value
                                        )
                                    }
                                    className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-gray-800 outline-none"
                                >
                                    <option value="all">
                                        เดือน: ทั้งหมด
                                    </option>

                                    {availableMonths.map(
                                        (month) => (
                                            <option
                                                key={month}
                                                value={month}
                                            >
                                                {monthNames[month - 1]}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={selectedYear}
                                    onChange={(e) =>
                                        handleYearChange(
                                            e.target.value
                                        )
                                    }
                                    className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-gray-800 outline-none"
                                >
                                    {years.map((year) => (
                                        <option
                                            key={year}
                                            value={year}
                                        >
                                            พ.ศ. {year + 543}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedDay === "range" && (
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(
                                                e.target.value
                                            );
                                        }}
                                        className="h-11 rounded-xl bg-white px-3 text-sm font-semibold text-gray-800 outline-none"
                                    />

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(
                                                e.target.value
                                            );
                                        }}
                                        className="h-11 rounded-xl bg-white px-3 text-sm font-semibold text-gray-800 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex items-center gap-2 px-1 text-sm font-semibold text-gray-700">
                <FaCalendarAlt className="text-blue-600" />
                {selectedDateText}
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                รายรับรวม
                            </p>

                            <p className="mt-2 text-2xl font-extrabold text-green-600">
                                ฿ {formatMoney(total.income)}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <FaArrowUp />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                รายจ่ายรวม
                            </p>

                            <p className="mt-2 text-2xl font-extrabold text-red-500">
                                ฿ {formatMoney(total.expense)}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
                            <FaArrowDown />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                ยอดคงเหลือรวม
                            </p>

                            <p className="mt-2 text-2xl font-extrabold text-blue-600">
                                ฿ {formatMoney(total.balance)}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FaWallet />
                        </div>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FaWallet />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                สรุปตามช่องทางบัญชี
                            </h2>

                            <p className="text-xs text-gray-500">
                                รายรับ รายจ่าย และยอดคงเหลือของแต่ละช่องทาง
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                        </div>
                    ) : accountSummary.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                <FaWallet className="text-2xl text-gray-300" />
                            </div>

                            <p className="mt-4 text-sm font-semibold text-gray-500">
                                ยังไม่มีข้อมูลช่องทางบัญชี
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {accountSummary.map(
                                (account) => (
                                    <div
                                        key={account.id}
                                        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 p-4">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                                <FaWallet />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-base font-bold text-gray-900">
                                                    {account.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    ช่องทางบัญชี
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 p-4">
                                            <div className="rounded-xl bg-green-50 p-3">
                                                <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                                    <FaArrowUp />
                                                    รายรับ
                                                </div>

                                                <p className="mt-2 truncate text-sm font-extrabold text-green-600 sm:text-base">
                                                    {formatMoney(
                                                        account.income
                                                    )}
                                                </p>

                                                <p className="text-[10px] text-gray-500">
                                                    บาท
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-red-50 p-3">
                                                <div className="flex items-center gap-1 text-xs font-semibold text-red-500">
                                                    <FaArrowDown />
                                                    รายจ่าย
                                                </div>

                                                <p className="mt-2 truncate text-sm font-extrabold text-red-500 sm:text-base">
                                                    {formatMoney(
                                                        account.expense
                                                    )}
                                                </p>

                                                <p className="text-[10px] text-gray-500">
                                                    บาท
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-blue-50 p-3">
                                                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                                                    <FaMoneyBillWave />
                                                    คงเหลือ
                                                </div>

                                                <p className="mt-2 truncate text-sm font-extrabold text-blue-600 sm:text-base">
                                                    {formatMoney(
                                                        account.balance
                                                    )}
                                                </p>

                                                <p className="text-[10px] text-gray-500">
                                                    บาท
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AccountSummary;