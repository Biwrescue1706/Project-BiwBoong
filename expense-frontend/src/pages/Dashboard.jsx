import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { errorAlert } from "../utils/alert";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaChartLine,
  FaReceipt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChevronRight,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Dashboard() {
  const currentDate = new Date();
  const today = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const transactionResponseData = transactionRes.data;
      const transactionData =
        transactionResponseData.data?.transactions ||
        transactionResponseData.data ||
        transactionResponseData.transactions ||
        [];

      const accountResponseData = accountRes.data;
      const accountData =
        accountResponseData.data?.accounts ||
        accountResponseData.data ||
        accountResponseData.accounts ||
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
        "ไม่สามารถโหลดข้อมูลการเงินได้"
      );
    } finally {
      setLoading(false);
    }
  };

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

  const days = Array.from(
    { length: 31 },
    (_, index) => index + 1
  );

  const formatThaiDate = (date) => {
    if (!date) return "-";

    const parts = String(date)
      .substring(0, 10)
      .split("-");

    if (parts.length !== 3) return date;

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      !year ||
      !month ||
      !day ||
      !thaiMonthNames[month - 1]
    ) {
      return date;
    }

    return `${day} ${thaiMonthNames[month - 1]
      } ${year + 543}`;
  };

  const years = useMemo(() => {
    const yearSet = new Set();

    transactions.forEach((item) => {
      if (!item.date) return;

      const parts = String(item.date)
        .substring(0, 10)
        .split("-");

      if (parts.length !== 3) return;

      const year = Number(parts[0]);

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

      const parts = String(item.date)
        .substring(0, 10)
        .split("-");

      if (parts.length !== 3) return;

      const year = Number(parts[0]);
      const month = Number(parts[1]);

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
        if (startDate && endDate) {
          return (
            itemDate >= startDate &&
            itemDate <= endDate
          );
        }

        if (startDate) {
          return itemDate >= startDate;
        }

        if (endDate) {
          return itemDate <= endDate;
        }

        return true;
      }

      if (year !== Number(selectedYear)) {
        return false;
      }

      if (
        selectedMonth !== "all" &&
        month !== Number(selectedMonth)
      ) {
        return false;
      }

      if (selectedDay === "today") {
        return itemDate === today;
      }

      if (
        selectedDay !== "all" &&
        day !== Number(selectedDay)
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

  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeTransactions = 0;
    let expenseTransactions = 0;

    filteredTransactions.forEach((item) => {
      const income = Number(item.income || 0);
      const expense = Number(item.expense || 0);

      totalIncome += income;
      totalExpense += expense;

      if (income > 0) {
        incomeTransactions++;
      }

      if (expense > 0) {
        expenseTransactions++;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalTransactions: filteredTransactions.length,
      incomeTransactions,
      expenseTransactions,
    };
  }, [filteredTransactions]);

  const accountSummary = useMemo(() => {
    const map = new Map();

    accounts.forEach((account) => {
      const id = String(
        account.id ||
        account.accountTypesId ||
        account.name ||
        ""
      );

      const name =
        account.name ||
        account.accountTypeName ||
        "ไม่ระบุบัญชี";

      map.set(id, {
        id,
        name,
        balance: Number(account.balance || 0),
        income: 0,
        expense: 0,
      });
    });

    filteredTransactions.forEach((item) => {
      const accountId = String(
        item.accountTypesId || ""
      );

      const accountName =
        item.accountTypeName ||
        "ไม่ระบุบัญชี";

      let account = map.get(accountId);

      if (!account) {
        account = {
          id: accountId || accountName,
          name: accountName,
          balance: 0,
          income: 0,
          expense: 0,
        };

        map.set(
          account.id,
          account
        );
      }

      account.income += Number(
        item.income || 0
      );

      account.expense += Number(
        item.expense || 0
      );
    });

    return Array.from(map.values()).sort(
      (a, b) => b.balance - a.balance
    );
  }, [accounts, filteredTransactions]);

  const latestTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => {
        const dateA = String(
          a.date || ""
        ).substring(0, 10);

        const dateB = String(
          b.date || ""
        ).substring(0, 10);

        if (dateA !== dateB) {
          return dateB.localeCompare(dateA);
        }

        const createdA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const createdB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return createdB - createdA;
      })
      .slice(0, 5);
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const grouped = {};

    filteredTransactions.forEach((item) => {
      if (!item.date) return;

      const date = String(item.date).substring(
        0,
        10
      );

      const [year, month, day] =
        date.split("-").map(Number);

      let key;
      let label;

      if (selectedDay === "range") {
        key = date;
        label = formatThaiDate(date);
      } else if (selectedMonth === "all") {
        key = `${year}-${String(month).padStart(
          2,
          "0"
        )}`;

        label = thaiMonthNames[month - 1];
      } else {
        key = date;
        label = `${day}`;
      }

      if (!grouped[key]) {
        grouped[key] = {
          key,
          label,
          income: 0,
          expense: 0,
        };
      }

      grouped[key].income += Number(
        item.income || 0
      );

      grouped[key].expense += Number(
        item.expense || 0
      );
    });

    return Object.values(grouped)
      .sort((a, b) =>
        a.key.localeCompare(b.key)
      )
      .map((item) => ({
        date: item.label,
        income: item.income,
        expense: item.expense,
      }));
  }, [
    filteredTransactions,
    selectedDay,
    selectedMonth,
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

      return;
    }

    if (value !== "range") {
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
    setSelectedDay("all");
    setSelectedMonth("all");
    setStartDate("");
    setEndDate("");
  };

  const handleStartDateChange = (value) => {
    setSelectedDay("range");
    setStartDate(value);

    if (value) {
      const [year] = value
        .split("-")
        .map(Number);

      setSelectedYear(year);
    }
  };

  const handleEndDateChange = (value) => {
    setSelectedDay("range");
    setEndDate(value);
  };

  const selectedDateText = useMemo(() => {
    if (selectedDay === "today") {
      return `วันนี้ ${formatThaiDate(today)}`;
    }

    if (selectedDay === "range") {
      if (startDate && endDate) {
        return `${formatThaiDate(
          startDate
        )} - ${formatThaiDate(endDate)}`;
      }

      if (startDate) {
        return `ตั้งแต่ ${formatThaiDate(
          startDate
        )}`;
      }

      if (endDate) {
        return `ถึง ${formatThaiDate(
          endDate
        )}`;
      }

      return "ระหว่างวันที่";
    }

    let text = "";

    if (selectedDay === "all") {
      text += "ทุกวัน";
    } else {
      text += `วันที่ ${selectedDay}`;
    }

    if (selectedMonth === "all") {
      text += " • ทุกเดือน";
    } else {
      text += ` • ${monthNames[
        Number(selectedMonth) - 1
      ]
        }`;
    }

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

  return (
    <div className="min-h-full space-y-5 bg-slate-50/50 pb-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 text-white shadow-lg shadow-green-600/10 sm:p-6 md:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <FaChartLine />
              </div>

              <span className="text-sm font-medium text-green-50">
                Financial Dashboard
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              ภาพรวมการเงิน
            </h1>

            <p className="mt-1 text-sm text-green-50 sm:text-base">
              สรุปรายรับ รายจ่าย และยอดคงเหลือของคุณ
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-md">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="relative">
                  <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-gray-800" />

                  <select
                    value={selectedDay}
                    onChange={(e) =>
                      handleDayChange(e.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border-0 bg-white pl-9 pr-4 text-sm font-semibold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-white/50"
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

                    {days.map((day) => (
                      <option
                        key={day}
                        value={day}
                      >
                        วันที่ {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) =>
                      handleMonthChange(
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border-0 bg-white px-4 pr-8 text-sm font-semibold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-white/50"
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
                          {
                            monthNames[
                            month - 1
                            ]
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) =>
                      handleYearChange(
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border-0 bg-white px-4 pr-8 text-sm font-semibold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-white/50"
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
              </div>

              {selectedDay === "range" && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block px-1 text-xs font-medium text-white">
                      วันที่เริ่มต้น
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        handleStartDateChange(
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border-0 bg-white px-3 text-sm font-semibold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block px-1 text-xs font-medium text-white">
                      วันที่สิ้นสุด
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        handleEndDateChange(
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border-0 bg-white px-3 text-sm font-semibold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 px-1 text-sm font-semibold text-gray-700">
        <FaCalendarAlt className="text-green-600" />
        <span>{selectedDateText}</span>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10 sm:p-5 md:p-6">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-50 transition-transform duration-300 group-hover:scale-125" />

          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                  รายรับ
                </p>

                <p className="mt-1 text-[11px] text-gray-900 sm:text-xs">
                  {selectedDateText}
                </p>
              </div>

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 sm:h-12 sm:w-12">
                <FaArrowUp className="text-sm sm:text-base" />
              </div>
            </div>

            <p className="mt-4 text-xl font-extrabold tracking-tight text-green-600 sm:text-2xl md:text-3xl">
              ฿ {summary.totalIncome.toLocaleString()}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-900">
              <FaReceipt className="text-[10px]" />
              {summary.incomeTransactions.toLocaleString()} รายการ
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10 sm:p-5 md:p-6">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-50 transition-transform duration-300 group-hover:scale-125" />

          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                  รายจ่าย
                </p>

                <p className="mt-1 text-[11px] text-gray-800 sm:text-xs">
                  {selectedDateText}
                </p>
              </div>

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500 sm:h-12 sm:w-12">
                <FaArrowDown className="text-sm sm:text-base" />
              </div>
            </div>

            <p className="mt-4 text-xl font-extrabold tracking-tight text-red-500 sm:text-2xl md:text-3xl">
              ฿ {summary.totalExpense.toLocaleString()}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-800">
              <FaReceipt className="text-[10px]" />
              {summary.expenseTransactions.toLocaleString()} รายการ
            </div>
          </div>
        </div>

        <div className="col-span-2 group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 sm:p-5 md:p-6 lg:col-span-1">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-125" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                คงเหลือ
              </p>

              <p className="mt-1 text-[13px] text-gray-800 sm:text-xs">
                {selectedDateText}
              </p>

              <p className="mt-4 truncate text-xl font-extrabold tracking-tight text-blue-600 sm:text-2xl md:text-3xl">
                ฿ {summary.balance.toLocaleString()}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-800">
                <FaMoneyBillWave className="text-[10px]" />
                ยอดคงเหลือสุทธิ
              </div>
            </div>

            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:h-16 sm:w-16">
              <FaWallet className="text-2xl sm:text-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaWallet />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                สรุปตามช่องทางบัญชี
              </h2>

              <p className="text-xs text-gray-800 sm:text-sm">
                รายรับ รายจ่าย และยอดคงเหลือแยกตามช่องทาง
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          {accountSummary.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {accountSummary.map((account) => (
                <div
                  key={account.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <FaWallet />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900 sm:text-base">
                          {account.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          ช่องทางบัญชี
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-[11px] font-medium text-gray-600">
                        รายรับ
                      </p>

                      <p className="mt-1 truncate text-sm font-extrabold text-green-600 sm:text-base">
                        {account.income.toLocaleString()}
                      </p>

                      <p className="text-[10px] text-gray-500">
                        บาท
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-50 p-3">
                      <p className="text-[11px] font-medium text-gray-600">
                        รายจ่าย
                      </p>

                      <p className="mt-1 truncate text-sm font-extrabold text-red-500 sm:text-base">
                        {account.expense.toLocaleString()}
                      </p>

                      <p className="text-[10px] text-gray-500">
                        บาท
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-[11px] font-medium text-gray-600">
                        คงเหลือ
                      </p>

                      <p className="mt-1 truncate text-sm font-extrabold text-blue-600 sm:text-base">
                        {account.balance.toLocaleString()}
                      </p>

                      <p className="text-[10px] text-gray-500">
                        บาท
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <FaWallet className="text-xl text-gray-300" />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-500">
                ยังไม่มีข้อมูลช่องทางบัญชี
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FaChartLine />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                รายรับ - รายจ่าย
              </h2>

              <p className="text-xs text-gray-800 sm:text-sm">
                {selectedDateText}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[270px] w-full px-1 pb-3 pt-3 sm:h-[350px] sm:px-4 sm:pb-5 md:h-[380px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: "#64748b",
                  }}
                  tickFormatter={(value) =>
                    Number(value).toLocaleString()
                  }
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) =>
                    `${Number(
                      value
                    ).toLocaleString()} บาท`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="รายรับ"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  name="รายจ่าย"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              ไม่มีข้อมูลสำหรับช่วงเวลาที่เลือก
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FaReceipt />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  รายการล่าสุด
                </h2>

                <p className="text-xs text-gray-800">
                  {selectedDateText}
                </p>
              </div>
            </div>

            <Link
              to="/transactions"
              className="group flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-50 sm:text-sm"
            >
              ดูทั้งหมด
              <FaChevronRight className="text-[10px] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                <p className="mt-4 text-sm text-gray-800">
                  กำลังโหลดข้อมูล...
                </p>
              </div>
            ) : latestTransactions.length > 0 ? (
              <div className="space-y-3">
                {latestTransactions.map(
                  (item) => {
                    const isIncome =
                      Number(item.income) > 0;

                    return (
                      <div
                        key={item.id}
                        className="group rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:border-gray-200 hover:bg-white hover:shadow-sm sm:p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${isIncome
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                              }`}
                          >
                            {isIncome ? (
                              <FaArrowUp />
                            ) : (
                              <FaArrowDown />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-gray-900">
                                  {item.categoryName ||
                                    "-"}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-800">
                                  {formatThaiDate(
                                    item.date
                                  )}
                                </p>
                              </div>

                              <p
                                className={`flex-shrink-0 text-sm font-extrabold ${isIncome
                                  ? "text-green-600"
                                  : "text-red-500"
                                  }`}
                              >
                                {isIncome
                                  ? "+"
                                  : "-"}
                                {Number(
                                  isIncome
                                    ? item.income
                                    : item.expense
                                ).toLocaleString()}{" "}
                                บาท
                              </p>
                            </div>

                            <div className="mt-2 grid gap-1 text-xs text-gray-900 sm:grid-cols-2">
                              <p className="truncate">
                                <span className="font-medium text-gray-700">
                                  ประเภท:
                                </span>{" "}
                                {item.typeName ||
                                  "-"}
                              </p>

                              <p className="truncate">
                                <span className="font-medium text-gray-700">
                                  หมวดหมู่:
                                </span>{" "}
                                {item.categoryName ||
                                  "-"}
                              </p>

                              <p className="truncate">
                                <span className="font-medium text-gray-700">
                                  ช่องทาง:
                                </span>{" "}
                                {item.accountTypeName ||
                                  "-"}
                              </p>

                              <p className="truncate">
                                <span className="font-medium text-gray-700">
                                  หมายเหตุ:
                                </span>{" "}
                                {item.note || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <FaWallet className="text-2xl text-gray-300" />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-500">
                  ยังไม่มีรายการ
                </p>

                <p className="mt-1 text-xs text-gray-800">
                  ยังไม่มีข้อมูลในช่วงเวลานี้
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaWallet />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  สรุปข้อมูล
                </h2>

                <p className="text-xs text-gray-800">
                  ภาพรวมของช่วงเวลาที่เลือก
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    จำนวนรายการ
                  </p>

                  <p className="mt-0.5 text-xs text-gray-800">
                    รายการทั้งหมด
                  </p>
                </div>

                <strong className="text-sm font-bold text-gray-900">
                  {summary.totalTransactions.toLocaleString()}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    จำนวนรายการรายรับ
                  </p>

                  <p className="mt-0.5 text-xs text-gray-800">
                    รายการเงินเข้า
                  </p>
                </div>

                <strong className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-bold text-green-600">
                  {summary.incomeTransactions.toLocaleString()}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    จำนวนรายการรายจ่าย
                  </p>

                  <p className="mt-0.5 text-xs text-gray-800">
                    รายการเงินออก
                  </p>
                </div>

                <strong className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-500">
                  {summary.expenseTransactions.toLocaleString()}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm font-medium text-gray-700">
                  รายรับทั้งหมด
                </span>

                <strong className="text-sm font-bold text-green-600">
                  {summary.totalIncome.toLocaleString()} บาท
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm font-medium text-gray-700">
                  รายจ่ายทั้งหมด
                </span>

                <strong className="text-sm font-bold text-red-500">
                  {summary.totalExpense.toLocaleString()} บาท
                </strong>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    คงเหลือสุทธิ
                  </p>

                  <p className="mt-1 text-xs text-gray-800">
                    รายรับ - รายจ่าย
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-extrabold text-blue-600 sm:text-2xl">
                    {summary.balance.toLocaleString()}
                  </p>

                  <p className="text-xs font-medium text-blue-400">
                    บาท
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;