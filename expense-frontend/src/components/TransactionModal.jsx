import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updateTransaction } from "../services/transaction.service";
import { getTypes } from "../services/type.service";
import { getCategories } from "../services/category.service";
import { successAlert, errorAlert } from "../utils/alert";

function TransactionModal({ open, onClose, onSuccess, editTransaction }) {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: "",
    typeId: "",
    categoryId: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    if (!open || !editTransaction) return;

    setForm({
      date: editTransaction.date || "",
      typeId: editTransaction.typeId || "",
      categoryId: editTransaction.categoryId || "",
      amount:
        editTransaction.income > 0
          ? editTransaction.income
          : editTransaction.expense > 0
            ? editTransaction.expense
            : "",
      note: editTransaction.note || "",
    });

    loadTypes();
  }, [open, editTransaction]);

  useEffect(() => {
    if (form.typeId) loadCategories(form.typeId);
    else setCategories([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "typeId") {
      setForm((prev) => ({ ...prev, typeId: value, categoryId: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editTransaction) return;

    if (!form.date) return errorAlert("กรุณาเลือกวันที่");
    if (!form.typeId) return errorAlert("กรุณาเลือกประเภท");
    if (!form.categoryId) return errorAlert("กรุณาเลือกหมวดหมู่");
    if (!form.amount || Number(form.amount) <= 0)
      return errorAlert("กรุณากรอกจำนวนเงิน");

    try {
      setLoading(true);

      await updateTransaction(editTransaction.id, {
        date: form.date,
        typeId: form.typeId,
        categoryId: form.categoryId,
        amount: Number(form.amount),
        note: form.note,
      });

      successAlert("แก้ไขรายการสำเร็จ");
      await onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      errorAlert(err.response?.data?.message || "แก้ไขรายการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !editTransaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">แก้ไขรายการ</h2>
            <p className="mt-1 text-sm text-gray-500">
              แก้ไขข้อมูลรายรับหรือรายจ่าย
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 transition hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              วันที่
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              ประเภท
            </label>
            <select
              name="typeId"
              value={form.typeId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            >
              <option value="">เลือกประเภท</option>
              {types.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              หมวดหมู่
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={!form.typeId}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:bg-gray-100"
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              จำนวนเงิน
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-14 text-lg font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                บาท
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              หมายเหตุ
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="รายละเอียดเพิ่มเติม"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
