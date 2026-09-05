// src/pages/AddTransaction.jsx

import { useEffect, useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaSave,
  FaWallet,
  FaMoneyBillWave,
  FaStickyNote,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { createTransaction } from "../services/transaction.service";
import { getTypes } from "../services/type.service";
import { getCategories } from "../services/category.service";

import { successAlert, errorAlert } from "../utils/alert";

function AddTransaction() {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    typeId: "",
    categoryId: "",
    amount: "",
    note: "",
  });

  // =========================================================
  // LOAD TYPES
  // =========================================================

  useEffect(() => {
    loadTypes();
  }, []);

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  useEffect(() => {
    if (form.typeId) {
      loadCategories(form.typeId);
    } else {
      setCategories([]);
    }
  }, [form.typeId]);

  const loadTypes = async () => {
    try {
      const data = await getTypes();

      setTypes(data || []);
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดประเภทได้");
    }
  };

  const loadCategories = async (typeId) => {
    try {
      const data = await getCategories(typeId);

      setCategories(data || []);
    } catch (err) {
      console.error(err);

      setCategories([]);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดหมวดหมู่ได้");
    }
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "typeId") {
      setForm((prev) => ({
        ...prev,
        typeId: value,
        categoryId: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date) {
      return errorAlert("กรุณาเลือกวันที่");
    }

    if (!form.typeId) {
      return errorAlert("กรุณาเลือกประเภท");
    }

    if (!form.categoryId) {
      return errorAlert("กรุณาเลือกหมวดหมู่");
    }

    if (!form.amount || Number(form.amount) <= 0) {
      return errorAlert("กรุณากรอกจำนวนเงิน");
    }

    try {
      setLoading(true);

      await createTransaction({
        date: form.date,
        typeId: form.typeId,
        categoryId: form.categoryId,
        amount: Number(form.amount),
        note: form.note,
      });

      successAlert("บันทึกรายการสำเร็จ");

      navigate("/transactions");
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "บันทึกรายการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SELECTED TYPE
  // =========================================================

  const selectedType = types.find(
    (item) => String(item.id) === String(form.typeId),
  );

  const isIncome =
    selectedType?.name === "รายรับ" ||
    selectedType?.name?.toLowerCase() === "income";

  const isExpense =
    selectedType?.name === "รายจ่าย" ||
    selectedType?.name?.toLowerCase() === "expense";

  // =========================================================
  // TYPE CARD
  // =========================================================

  const getTypeStyle = (item) => {
    const income =
      item.name === "รายรับ" || item.name?.toLowerCase() === "income";

    const expense =
      item.name === "รายจ่าย" || item.name?.toLowerCase() === "expense";

    const selected = String(form.typeId) === String(item.id);

    if (selected && income) {
      return {
        container: "border-green-500 bg-green-50 shadow-md shadow-green-500/10",
        icon: "bg-green-500 text-white",
        text: "text-green-700",
      };
    }

    if (selected && expense) {
      return {
        container: "border-red-500 bg-red-50 shadow-md shadow-red-500/10",
        icon: "bg-red-500 text-white",
        text: "text-red-700",
      };
    }

    return {
      container:
        "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50",
      icon: "bg-gray-100 text-black",
      text: "text-black",
    };
  };

  return (
    <div className="min-h-full bg-slate-50/60 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <section
          className="
            relative
            mb-5
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-green-600
            via-emerald-600
            to-teal-600
            p-5
            text-white
            shadow-lg
            shadow-green-600/10

            sm:p-6
            md:p-7
          "
        >
          {/* Decoration */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur-sm sm:h-14 sm:w-14 sm:text-2xl">
              <FaWallet />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                เพิ่มรายการ
              </h1>

              <p className="mt-1 text-sm text-white sm:text-base">
                บันทึกรายรับหรือรายจ่ายของคุณ
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            FORM
        ================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Form Header */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FaSave />
                </div>

                <div>
                  <h2 className="font-bold text-black sm:text-lg">
                    รายละเอียดรายการ
                  </h2>

                  <p className="mt-0.5 text-xs text-black sm:text-sm">
                    กรอกข้อมูลรายการให้ครบถ้วน
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="space-y-6 p-5 sm:p-6 md:p-7">
              {/* =================================================
                  TYPE
              ================================================== */}

              <div>
                <label className="mb-3 block text-sm font-bold text-black">
                  ประเภท
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {types.map((item) => {
                    const income =
                      item.name === "รายรับ" ||
                      item.name?.toLowerCase() === "income";

                    const expense =
                      item.name === "รายจ่าย" ||
                      item.name?.toLowerCase() === "expense";

                    const selected = String(form.typeId) === String(item.id);

                    const styles = getTypeStyle(item);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: {
                              name: "typeId",
                              value: String(item.id),
                            },
                          })
                        }
                        className={`
                          group
                          flex
                          min-h-[76px]
                          items-center
                          justify-center
                          gap-3
                          rounded-2xl
                          border-2
                          px-4
                          py-3
                          transition-all
                          duration-200
                          active:scale-[0.98]

                          ${styles.container}
                        `}
                      >
                        <div
                          className={`
                            flex
                            h-10
                            w-10
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            transition-transform
                            duration-200
                            group-hover:scale-105

                            ${styles.icon}
                          `}
                        >
                          {income ? (
                            <FaArrowUp />
                          ) : expense ? (
                            <FaArrowDown />
                          ) : (
                            <FaWallet />
                          )}
                        </div>

                        <span
                          className={`
                            text-sm
                            font-bold
                            sm:text-base

                            ${styles.text}
                          `}
                        >
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  CATEGORY
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  หมวดหมู่
                </label>

                <div className="relative">
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    disabled={!form.typeId}
                    className="
                      h-13
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      pr-10
                      text-sm
                      font-medium
                      text-black
                      outline-none
                      transition

                      focus:border-green-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-green-500/10

                      disabled:cursor-not-allowed
                      disabled:bg-gray-100
                      disabled:text-black
                    "
                  >
                    <option value="">
                      {form.typeId ? "เลือกหมวดหมู่" : "กรุณาเลือกประเภทก่อน"}
                    </option>

                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                    ▾
                  </div>
                </div>
              </div>

              {/* =================================================
                  AMOUNT
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  จำนวนเงิน
                </label>

                <div className="relative">
                  <div
                    className={`
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg

                      ${
                        isIncome
                          ? "bg-green-100 text-green-600"
                          : isExpense
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-black"
                      }
                    `}
                  >
                    <FaMoneyBillWave />
                  </div>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`
                      h-16
                      w-full
                      rounded-2xl
                      border
                      bg-white
                      pl-16
                      pr-16
                      text-xl
                      font-extrabold
                      text-black
                      outline-none
                      transition
                      placeholder:text-gray-400

                      ${
                        isIncome
                          ? "border-green-200 focus:border-green-500 focus:ring-green-500/10"
                          : isExpense
                            ? "border-red-200 focus:border-red-500 focus:ring-red-500/10"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-500/10"
                      }

                      focus:ring-4
                    `}
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-black">
                    บาท
                  </span>
                </div>

                {form.amount && (
                  <p
                    className={`
                      mt-2
                      text-xs
                      font-semibold

                      ${
                        isIncome
                          ? "text-green-600"
                          : isExpense
                            ? "text-red-600"
                            : "text-black"
                      }
                    `}
                  >
                    {isIncome ? "รายรับ" : isExpense ? "รายจ่าย" : "จำนวนเงิน"}{" "}
                    {Number(form.amount).toLocaleString()} บาท
                  </p>
                )}
              </div>

              {/* =================================================
                  DATE
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-bold text-black">
                  วันที่
                </label>

                <div className="relative">
                  <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-11
                      py-3.5
                      text-sm
                      font-medium
                      text-black
                      outline-none
                      transition

                      focus:border-green-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-green-500/10
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  NOTE
              ================================================== */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black">
                  <FaStickyNote className="text-green-600" />
                  รายละเอียด
                </label>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="เช่น ซื้ออาหารกลางวัน, เงินเดือน, ค่าเดินทาง"
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    text-black
                    outline-none
                    transition
                    placeholder:text-gray-500

                    focus:border-green-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-500/10
                  "
                />

                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-black">
                    สามารถใส่รายละเอียดเพิ่มเติมได้
                  </span>

                  <span className="text-xs font-medium text-black">
                    {form.note.length} ตัวอักษร
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  min-h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-green-600
                  to-emerald-600
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-green-500/20
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:from-green-700
                  hover:to-emerald-700
                  hover:shadow-xl
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <FaSave className="transition-transform group-hover:scale-110" />

                {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>

              <p className="mt-3 text-center text-xs font-medium text-black">
                ตรวจสอบข้อมูลให้ถูกต้องก่อนกดบันทึก
              </p>
            </div>
          </form>
        </div>

        {/* =================================================
            INFORMATION
        ================================================== */}

        <div className="mt-4 rounded-2xl border border-green-100 bg-green-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaWallet />
            </div>

            <div>
              <p className="text-sm font-bold text-black">เคล็ดลับ</p>

              <p className="mt-1 text-xs leading-5 text-black sm:text-sm">
                เลือกประเภทและหมวดหมู่ให้ตรงกับรายการ
                เพื่อให้สรุปรายรับรายจ่ายและรายงานของคุณถูกต้อง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
