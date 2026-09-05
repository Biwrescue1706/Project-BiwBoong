import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaList,
  FaFilePdf,
  FaFilter,
  FaCalendarAlt,
  FaWallet,
  FaReceipt,
  FaTimes,
  FaCreditCard,
} from "react-icons/fa";
import api from "../api/axios";
import { getTransactions, deleteTransaction } from "../services/transaction.service";
import TransactionModal from "../components/TransactionModal";
import { successAlert, errorAlert, confirmDelete } from "../utils/alert";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    loadTransactions();
    loadUser();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดรายการได้");
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้");
    }
  };

  const formatThaiDate = (date) => {
    if (!date) return "-";
    const [year, month, day] = date.split("-").map(Number);
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    if (!year || !month || !day || !months[month - 1]) return date;
    return `${day} ${months[month - 1]} ${year + 543}`;
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (!result.isConfirmed) return;

    try {
      await deleteTransaction(id);
      successAlert("ลบรายการสำเร็จ");
      await loadTransactions();
    } catch (err) {
      errorAlert(err.response?.data?.message || "ไม่สามารถลบรายการได้");
    }
  };

  const handleSuccess = async () => {
    await loadTransactions();
  };

  const handleStartDateChange = (value) => {
    setSelectedYear("");
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setSelectedYear("");
    setEndDate(value);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (year) {
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleClearFilter = () => {
    setSelectedYear("");
    setStartDate("");
    setEndDate("");
  };

  const availableYears = useMemo(() => {
    const years = transactions
      .map((transaction) => transaction.date ? transaction.date.substring(0, 4) : null)
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (startDate) {
      result = result.filter((transaction) => transaction.date >= startDate);
    }

    if (endDate) {
      result = result.filter((transaction) => transaction.date <= endDate);
    }

    return result.sort((a, b) =>
      String(a.date || "").localeCompare(String(b.date || ""))
    );
  }, [transactions, startDate, endDate]);

  const totalIncome = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.income || 0),
      0
    );
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.expense || 0),
      0
    );
  }, [filteredTransactions]);

  const latestBalance = useMemo(() => {
    if (filteredTransactions.length === 0) return 0;
    const lastTransaction = filteredTransactions[filteredTransactions.length - 1];
    return Number(lastTransaction.balance || 0);
  }, [filteredTransactions]);

  const accountSummary = useMemo(() => {
    const summary = {};

    filteredTransactions.forEach((transaction) => {
      const id = transaction.accountTypesId || transaction.accountTypeId || "unknown";
      const name = transaction.accountTypeName || "ไม่ระบุช่องทาง";

      if (!summary[id]) {
        summary[id] = {
          id,
          name,
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      summary[id].income += Number(transaction.income || 0);
      summary[id].expense += Number(transaction.expense || 0);
      summary[id].balance +=
        Number(transaction.income || 0) - Number(transaction.expense || 0);
    });

    return Object.values(summary);
  }, [filteredTransactions]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  };

  const handleExportPDF = async () => {
    if (startDate && endDate && startDate > endDate) {
      errorAlert("วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด");
      return;
    }

    if (filteredTransactions.length === 0) {
      errorAlert("ไม่มีข้อมูลในช่วงวันที่หรือปีที่เลือก");
      return;
    }

    try {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const fontUrl = "/fonts/THSarabunNew.ttf";
      const response = await fetch(fontUrl);

      if (!response.ok) {
        throw new Error("ไม่พบไฟล์ฟอนต์ THSarabunNew.ttf");
      }

      const fontBuffer = await response.arrayBuffer();
      const fontBase64 = arrayBufferToBase64(fontBuffer);

      pdf.addFileToVFS("THSarabunNew.ttf", fontBase64);
      pdf.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
      pdf.setFont("THSarabunNew", "normal");

      const userName = user?.fullName || user?.FullName || "-";

      const pdfTransactions = [...filteredTransactions].sort((a, b) =>
        String(a.date || "").localeCompare(String(b.date || ""))
      );

      const reportStartDate =
        startDate ||
        (selectedYear ? `${selectedYear}-01-01` : pdfTransactions[0]?.date || "");

      const reportEndDate =
        endDate ||
        (selectedYear
          ? `${selectedYear}-12-31`
          : pdfTransactions[pdfTransactions.length - 1]?.date || "");

      const today = new Date().toISOString().split("T")[0];

      const tableData = pdfTransactions.map((transaction) => [
        formatThaiDate(transaction.date),
        transaction.categoryName || "-",
        transaction.accountTypeName || "-",
        Number(transaction.income || 0) > 0
          ? Number(transaction.income).toLocaleString()
          : "-",
        Number(transaction.expense || 0) > 0
          ? Number(transaction.expense).toLocaleString()
          : "-",
        Number(transaction.balance || 0).toLocaleString(),
        transaction.note || "-",
      ]);

      const drawPageHeader = () => {
        pdf.setFont("THSarabunNew", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(22);
        pdf.text("รายงานรายการรายรับรายจ่าย", 105, 18, { align: "center" });
        pdf.setFontSize(15);
        pdf.text(userName, 15, 27);
        pdf.text(
          `ช่วงวันที่: ${formatThaiDate(reportStartDate)} - ${formatThaiDate(reportEndDate)}`,
          15,
          35
        );

        pdf.setFontSize(14);
        pdf.setTextColor(22, 163, 74);
        pdf.text(`รายรับทั้งหมด: ${totalIncome.toLocaleString()} บาท`, 15, 43);
        pdf.setTextColor(220, 38, 38);
        pdf.text(`รายจ่ายทั้งหมด: ${totalExpense.toLocaleString()} บาท`, 75, 43);
        pdf.setTextColor(37, 99, 235);
        pdf.text(`คงเหลือ: ${latestBalance.toLocaleString()} บาท`, 155, 43);
        pdf.setTextColor(0, 0, 0);
      };

      const drawPageFooter = (page, pageCount) => {
        pdf.setFont("THSarabunNew", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`วันที่ออกรายงาน: ${formatThaiDate(today)}`, 105, 287, {
          align: "center",
        });
        pdf.text(`หน้า ${page} / ${pageCount}`, 200, 287, {
          align: "right",
        });
      };

      autoTable(pdf, {
        startY: 50,
        head: [["วันที่", "รายการ", "ช่องทาง", "รายรับ", "รายจ่าย", "คงเหลือ", "หมายเหตุ"]],
        body: tableData,
        theme: "grid",
        styles: {
          font: "THSarabunNew",
          fontStyle: "normal",
          fontSize: 12,
          cellPadding: 2.5,
          textColor: [0, 0, 0],
          lineColor: [180, 180, 180],
          lineWidth: 0.3,
        },
        headStyles: {
          font: "THSarabunNew",
          fontStyle: "normal",
          fontSize: 12,
          fillColor: [243, 244, 246],
          textColor: [0, 0, 0],
          halign: "center",
          lineColor: [150, 150, 150],
          lineWidth: 0.3,
        },
        columnStyles: {
          0: { cellWidth: 23, halign: "center" },
          1: { cellWidth: 35, halign: "center" },
          2: { cellWidth: 30, halign: "center" },
          3: { cellWidth: 18, halign: "right" },
          4: { cellWidth: 18, halign: "right" },
          5: { cellWidth: 18, halign: "right" },
          6: { cellWidth: "auto", halign: "left" },
        },
        didParseCell: (data) => {
          if (data.section !== "body") return;
          if (data.column.index === 3) data.cell.styles.textColor = [22, 163, 74];
          if (data.column.index === 4) data.cell.styles.textColor = [220, 38, 38];
          if (data.column.index === 5) data.cell.styles.textColor = [37, 99, 235];
        },
        margin: { top: 50, bottom: 20, left: 10, right: 10 },
        didDrawPage: () => {
          drawPageHeader();
        },
      });

      const pageCount = pdf.internal.getNumberOfPages();

      for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);
        drawPageFooter(page, pageCount);
      }

      let fileName = "รายงานรายรับรายจ่าย";

      if (selectedYear) {
        fileName += `_พ.ศ.${Number(selectedYear) + 543}`;
      } else if (startDate || endDate) {
        fileName += `_${startDate || "เริ่มต้น"}_ถึง_${endDate || "สิ้นสุด"}`;
      } else {
        fileName += `_${today}`;
      }

      pdf.save(`${fileName}.pdf`);
      successAlert("ส่งออก PDF สำเร็จ");
    } catch (err) {
      console.error(err);
      errorAlert(err.message || "ไม่สามารถสร้างไฟล์ PDF ได้");
    }
  };

  return (
    <div className="min-h-full space-y-5 bg-slate-50/50 pb-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 text-white shadow-lg shadow-green-600/10 sm:p-6 md:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <FaReceipt />
              </div>
              <span className="text-sm font-medium text-white">
                Financial Transactions
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              รายการรายรับรายจ่าย
            </h1>

            <p className="mt-1 text-sm text-white sm:text-base">
              จัดการ ตรวจสอบ และติดตามรายการทางการเงิน
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
            <button
              onClick={() => navigate("/add-transaction")}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-xl active:scale-[0.98] sm:w-auto"
            >
              <FaPlus className="transition-transform group-hover:rotate-90" />
              เพิ่มรายการ
            </button>

            <button
              onClick={handleExportPDF}
              disabled={loading || filteredTransactions.length === 0}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-600 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <FaFilePdf className="transition-transform group-hover:scale-110" />
              ส่งออก PDF
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-4 sm:p-5 md:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <FaFilter />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">กรองข้อมูล</h2>
            <p className="text-xs text-black sm:text-sm">
              เลือกช่วงวันที่หรือปีที่ต้องการดู
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
                <FaCalendarAlt className="text-green-600" />
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-black outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
                <FaCalendarAlt className="text-green-600" />
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-black outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
                <FaCalendarAlt className="text-green-600" />
                เลือกปี
              </label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-black outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              >
                <option value="">-- เลือกปี --</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    พ.ศ. {Number(year) + 543}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-black">
              <FaList className="text-green-600" />
              <span>พบข้อมูล</span>
              <strong className="font-bold text-black">
                {filteredTransactions.length.toLocaleString()}
              </strong>
              <span>รายการ</span>
            </div>

            {(startDate || endDate || selectedYear) && (
              <button
                onClick={handleClearFilter}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-[0.98]"
              >
                <FaTimes />
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>
      </section>

      {!loading && filteredTransactions.length > 0 && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-50 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-black">รายรับทั้งหมด</p>
                  <p className="mt-1 text-xs text-black">เงินที่ได้รับทั้งหมด</p>
                  <p className="mt-4 text-2xl font-extrabold text-green-600 sm:text-3xl">
                    +{totalIncome.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs font-medium text-black">บาท</p>
                </div>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <FaArrowUp />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-50 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-black">รายจ่ายทั้งหมด</p>
                  <p className="mt-1 text-xs text-black">เงินที่จ่ายออกทั้งหมด</p>
                  <p className="mt-4 text-2xl font-extrabold text-red-600 sm:text-3xl">
                    -{totalExpense.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs font-medium text-black">บาท</p>
                </div>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <FaArrowDown />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 sm:col-span-2 lg:col-span-1">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-black">คงเหลือ</p>
                  <p className="mt-1 text-xs text-black">ยอดคงเหลือสุทธิ</p>
                  <p className="mt-4 truncate text-2xl font-extrabold text-blue-600 sm:text-3xl">
                    {latestBalance.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs font-medium text-black">บาท</p>
                </div>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FaWallet />
                </div>
              </div>
            </div>
          </section>

          {accountSummary.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 p-4 sm:p-5 md:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaCreditCard />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">สรุปตามช่องทางบัญชี</h2>
                  <p className="text-xs text-black sm:text-sm">
                    ยอดรายรับ รายจ่าย และคงเหลือแยกตามช่องทาง
                  </p>
                </div>
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                {accountSummary.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <FaCreditCard />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-black">
                          {account.name}
                        </p>
                        <p className="text-xs text-black">ช่องทางบัญชี</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-green-50 p-3">
                        <p className="text-[10px] font-medium text-black">รายรับ</p>
                        <p className="mt-1 truncate text-sm font-bold text-green-600">
                          +{account.income.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-50 p-3">
                        <p className="text-[10px] font-medium text-black">รายจ่าย</p>
                        <p className="mt-1 truncate text-sm font-bold text-red-600">
                          -{account.expense.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-3">
                        <p className="text-[10px] font-medium text-black">คงเหลือ</p>
                        <p className="mt-1 truncate text-sm font-bold text-blue-600">
                          {account.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FaList />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">รายการทั้งหมด</h2>
              <p className="text-xs text-black sm:text-sm">รายการรายรับและรายจ่าย</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-black">
            <FaReceipt className="text-green-600" />
            <span>ทั้งหมด</span>
            <strong>{filteredTransactions.length.toLocaleString()}</strong>
            <span>รายการ</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-5 py-16">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-green-100" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-600" />
              <FaWallet className="text-xl text-green-600" />
            </div>
            <p className="mt-5 text-sm font-semibold text-black">กำลังโหลดข้อมูล...</p>
            <p className="mt-1 text-xs text-black">กรุณารอสักครู่</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <FaReceipt className="text-3xl text-black" />
            </div>
            <h3 className="mt-5 text-base font-bold text-black">ไม่พบรายการ</h3>
            <p className="mt-1 max-w-sm text-sm text-black">
              ไม่พบรายการรายรับรายจ่ายในช่วงเวลาที่เลือก
            </p>
            <button
              onClick={handleClearFilter}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
            >
              <FaTimes />
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 md:hidden">
              {filteredTransactions.map((transaction) => {
                const isIncome = Number(transaction.income) > 0;

                return (
                  <div
                    key={transaction.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${isIncome
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {isIncome ? <FaArrowUp /> : <FaArrowDown />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-black">
                              {transaction.categoryName || "-"}
                            </h3>
                            <p className="mt-1 text-xs text-black">
                              {formatThaiDate(transaction.date)}
                            </p>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            {isIncome ? (
                              <p className="text-sm font-extrabold text-green-600">
                                +{Number(transaction.income).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-sm font-extrabold text-red-600">
                                -{Number(transaction.expense).toLocaleString()}
                              </p>
                            )}
                            <p className="text-[10px] font-medium text-black">บาท</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-[10px] font-medium text-black">ประเภท</p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-black">
                          {transaction.typeName || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-black">หมวดหมู่</p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-black">
                          {transaction.categoryName || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-black">ช่องทาง</p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-semibold text-black">
                          <FaCreditCard className="flex-shrink-0 text-blue-600" />
                          {transaction.accountTypeName || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-black">คงเหลือ</p>
                        <p className="mt-0.5 text-xs font-bold text-blue-600">
                          {Number(transaction.balance || 0).toLocaleString()} บาท
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-[10px] font-medium text-black">หมายเหตุ</p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-black">
                          {transaction.note || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-yellow-50 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100 active:scale-[0.98]"
                      >
                        <FaEdit />
                        แก้ไข
                      </button>

                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
                      >
                        <FaTrash />
                        ลบ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-[1180px] w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold text-black">วันที่</th>
                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold text-black">รายการ</th>
                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold text-black">ช่องทาง</th>
                    <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-bold text-black">รายรับ</th>
                    <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-bold text-black">รายจ่าย</th>
                    <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-bold text-black">คงเหลือ</th>
                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold text-black">หมายเหตุ</th>
                    <th className="whitespace-nowrap px-5 py-4 text-center text-xs font-bold text-black">แก้ไข</th>
                    <th className="whitespace-nowrap px-5 py-4 text-center text-xs font-bold text-black">ลบ</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 transition-colors hover:bg-green-50/40"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-black">
                        {formatThaiDate(transaction.date)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${Number(transaction.income) > 0
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                              }`}
                          >
                            {Number(transaction.income) > 0 ? (
                              <FaArrowUp />
                            ) : (
                              <FaArrowDown />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-black">
                              {transaction.categoryName || "-"}
                            </p>
                            <p className="mt-0.5 text-xs text-black">
                              {transaction.typeName || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FaCreditCard />
                          </div>
                          <span className="font-semibold text-black">
                            {transaction.accountTypeName || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {Number(transaction.income) > 0 ? (
                          <span className="font-bold text-green-600">
                            +{Number(transaction.income).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-black">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {Number(transaction.expense) > 0 ? (
                          <span className="font-bold text-red-600">
                            -{Number(transaction.expense).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-black">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-blue-600">
                          {Number(transaction.balance || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="max-w-[220px] px-5 py-4">
                        <p className="truncate text-sm font-medium text-black">
                          {transaction.note || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 transition hover:bg-yellow-100 hover:text-yellow-700 active:scale-95"
                            title="แก้ไข"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 active:scale-95"
                            title="ลบ"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTransaction(null);
        }}
        onSuccess={handleSuccess}
        editTransaction={editTransaction}
      />
    </div>
  );
}

export default Transactions;