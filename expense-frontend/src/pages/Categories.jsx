import { useEffect, useState } from "react";

import {
  FaPlus,
  FaList,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaTags,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

import { getTypes } from "../services/type.service";

import { successAlert, errorAlert, confirmDelete } from "../utils/alert";

function Categories() {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    typeId: "",
    name: "",
  });

  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD TYPES
  // =========================================================

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const data = await getTypes();

      setTypes(data || []);
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดประเภทได้");
    }
  };

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  const loadCategories = async (id) => {
    if (!id) {
      setCategories([]);
      return;
    }

    try {
      const data = await getCategories(id);

      setCategories(data || []);
    } catch (err) {
      console.error(err);

      setCategories([]);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดหมวดหมู่ได้");
    }
  };

  // =========================================================
  // OPEN ADD
  // =========================================================

  const handleAdd = () => {
    setEditing(null);

    setForm({
      typeId: typeId || "",
      name: "",
    });

    setOpen(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleEdit = (item) => {
    setEditing(item);

    setForm({
      typeId: item.typeId,
      name: item.name,
    });

    setOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditing(null);

    setForm({
      typeId: typeId || "",
      name: "",
    });
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async () => {
    if (!form.typeId || !form.name.trim()) {
      return errorAlert("กรุณากรอกข้อมูลให้ครบ");
    }

    try {
      setSaving(true);

      const payload = {
        typeId: form.typeId,
        name: form.name.trim(),
      };

      if (editing) {
        const result = await updateCategory(editing.id, payload);

        setOpen(false);
        setEditing(null);

        setForm({
          typeId: typeId || "",
          name: "",
        });

        await loadCategories(typeId);

        successAlert(result?.message || "แก้ไขหมวดหมู่สำเร็จ");
      } else {
        const result = await createCategory(payload);

        setOpen(false);

        setForm({
          typeId: typeId || "",
          name: "",
        });

        await loadCategories(typeId);

        successAlert(result?.message || "เพิ่มหมวดหมู่สำเร็จ");
      }
    } catch (err) {
      errorAlert(
        err.response?.data?.message || err.message || "เกิดข้อผิดพลาด",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCategory(id);

      await loadCategories(typeId);

      successAlert(response?.message || "ลบหมวดหมู่สำเร็จ");
    } catch (err) {
      errorAlert(
        err.response?.data?.message || err.message || "เกิดข้อผิดพลาด",
      );
    }
  };

  // =========================================================
  // TYPE INFO
  // =========================================================

  const selectedType = types.find((item) => String(item.id) === String(typeId));

  const isIncome = selectedType?.name === "รายรับ";

  const getTypeInfo = (name) => {
    if (name === "รายรับ") {
      return {
        icon: <FaArrowUp />,
        iconClass: "bg-green-100 text-green-600",
        badgeClass: "border-green-200 bg-green-100 text-green-700",
      };
    }

    return {
      icon: <FaArrowDown />,
      iconClass: "bg-red-100 text-red-600",
      badgeClass: "border-red-200 bg-red-100 text-red-700",
    };
  };

  return (
    <div
      className="
        min-h-full
        bg-slate-50/60
        px-4
        py-5

        sm:px-6
        sm:py-7

        lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

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
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-52
              w-52
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              right-1/3
              h-40
              w-40
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/15
                  text-xl
                  backdrop-blur-sm

                  sm:h-14
                  sm:w-14
                  sm:text-2xl
                "
              >
                <FaList />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-extrabold
                    tracking-tight

                    sm:text-3xl
                  "
                >
                  หมวดหมู่
                </h1>

                <p className="mt-1 text-sm text-white sm:text-base">
                  จัดการหมวดหมู่รายรับและรายจ่าย
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="
                group
                flex
                min-h-[48px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                text-sm
                font-bold
                text-green-700
                shadow-lg
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-green-50
                hover:shadow-xl

                active:scale-[0.98]

                sm:w-auto
              "
            >
              <FaPlus className="transition-transform group-hover:rotate-90" />
              เพิ่มหมวดหมู่
            </button>
          </div>
        </section>

        {/* =====================================================
            FILTER
        ====================================================== */}

        <section
          className="
            mb-5
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm

            sm:p-6
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <FaTags className="text-green-600" />

                <label className="text-sm font-bold text-black">
                  เลือกประเภท
                </label>
              </div>

              <select
                value={typeId}
                onChange={(e) => {
                  const value = e.target.value;

                  setTypeId(value);

                  loadCategories(value);
                }}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  text-sm
                  font-semibold
                  text-black
                  outline-none
                  transition

                  focus:border-green-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-green-500/10

                  sm:max-w-md
                "
              >
                <option value="">เลือกประเภท</option>

                {types.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedType && (
              <div
                className={`
                  flex
                  h-12
                  items-center
                  gap-2
                  rounded-xl
                  border
                  px-4

                  ${
                    isIncome
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                {isIncome ? <FaArrowUp /> : <FaArrowDown />}

                <span className="text-sm font-bold">{selectedType.name}</span>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Total */}

          <div
            className="
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-black">
                  หมวดหมู่ทั้งหมด
                </p>

                <p className="mt-2 text-3xl font-extrabold text-black">
                  {categories.length}
                </p>

                <p className="mt-1 text-xs font-medium text-black">
                  {selectedType
                    ? `ของประเภท ${selectedType.name}`
                    : "เลือกประเภทเพื่อดูข้อมูล"}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FaList />
              </div>
            </div>
          </div>

          {/* Current Type */}

          <div
            className={`
              rounded-2xl
              border
              bg-white
              p-5
              shadow-sm

              ${
                selectedType
                  ? isIncome
                    ? "border-green-100"
                    : "border-red-100"
                  : "border-gray-100"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-black">
                  ประเภทที่เลือก
                </p>

                <p
                  className={`
                    mt-2
                    text-xl
                    font-extrabold

                    ${
                      selectedType
                        ? isIncome
                          ? "text-green-600"
                          : "text-red-600"
                        : "text-black"
                    }
                  `}
                >
                  {selectedType?.name || "ยังไม่ได้เลือก"}
                </p>

                <p className="mt-1 text-xs font-medium text-black">
                  {selectedType ? "กำลังแสดงหมวดหมู่" : "เลือกประเภทด้านบน"}
                </p>
              </div>

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl

                  ${
                    selectedType
                      ? isIncome
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                      : "bg-gray-100 text-black"
                  }
                `}
              >
                {selectedType ? (
                  isIncome ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )
                ) : (
                  <FaTags />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORY LIST
        ====================================================== */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-100
            bg-white
            shadow-sm
          "
        >
          {/* Header */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-gray-100
              p-5

              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:p-6
            "
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FaList />
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">รายการหมวดหมู่</h2>

                <p className="text-xs font-medium text-black sm:text-sm">
                  จัดการหมวดหมู่ของรายการ
                </p>
              </div>
            </div>

            <div className="text-sm font-semibold text-black">
              ทั้งหมด{" "}
              <span className="text-green-600">{categories.length}</span> รายการ
            </div>
          </div>

          {/* ===================================================
              NO TYPE
          ==================================================== */}

          {!typeId ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gray-100
                  text-3xl
                  text-black
                "
              >
                <FaTags />
              </div>

              <h3 className="mt-5 text-base font-bold text-black">
                กรุณาเลือกประเภท
              </h3>

              <p className="mt-1 max-w-sm text-sm font-medium text-black">
                เลือกประเภทด้านบนเพื่อแสดงรายการหมวดหมู่
              </p>
            </div>
          ) : categories.length === 0 ? (
            /* =================================================
               EMPTY
            ================================================== */

            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gray-100
                  text-3xl
                  text-black
                "
              >
                <FaList />
              </div>

              <h3 className="mt-5 text-base font-bold text-black">
                ยังไม่มีหมวดหมู่
              </h3>

              <p className="mt-1 max-w-sm text-sm font-medium text-black">
                เริ่มต้นด้วยการเพิ่มหมวดหมู่สำหรับ {selectedType?.name}
              </p>

              <button
                type="button"
                onClick={handleAdd}
                className="
                  mt-5
                  flex
                  min-h-[44px]
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition

                  hover:bg-green-700
                  active:scale-[0.98]
                "
              >
                <FaPlus />
                เพิ่มหมวดหมู่
              </button>
            </div>
          ) : (
            <>
              {/* =================================================
                  MOBILE
              ================================================== */}

              <div className="space-y-3 p-4 md:hidden">
                {categories.map((item) => {
                  const typeInfo = getTypeInfo(selectedType?.name);

                  return (
                    <div
                      key={item.id}
                      className="
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        p-4
                        shadow-sm
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-xl

                            ${typeInfo.iconClass}
                          `}
                        >
                          {typeInfo.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-black">
                            หมวดหมู่
                          </p>

                          <h3 className="mt-1 truncate text-base font-bold text-black">
                            {item.name}
                          </h3>
                        </div>

                        <span
                          className={`
                            hidden
                            rounded-full
                            border
                            px-3
                            py-1
                            text-xs
                            font-bold

                            sm:inline-flex

                            ${typeInfo.badgeClass}
                          `}
                        >
                          {selectedType?.name}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="
                            flex
                            min-h-[44px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-50
                            text-sm
                            font-bold
                            text-blue-600
                            transition

                            hover:bg-blue-100
                            active:scale-[0.98]
                          "
                        >
                          <FaEdit />
                          แก้ไข
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="
                            flex
                            min-h-[44px]
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-red-50
                            text-sm
                            font-bold
                            text-red-600
                            transition

                            hover:bg-red-100
                            active:scale-[0.98]
                          "
                        >
                          <FaTrash />
                          ลบ
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-bold text-black">
                        หมวดหมู่
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold text-black">
                        ประเภท
                      </th>

                      <th className="w-40 px-6 py-4 text-center text-xs font-bold text-black">
                        จัดการ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((item) => {
                      const typeInfo = getTypeInfo(selectedType?.name);

                      return (
                        <tr
                          key={item.id}
                          className="
                            border-b
                            border-gray-100
                            transition-colors

                            hover:bg-green-50/40
                          "
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl

                                  ${typeInfo.iconClass}
                                `}
                              >
                                {typeInfo.icon}
                              </div>

                              <span className="font-bold text-black">
                                {item.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                px-3
                                py-1
                                text-xs
                                font-bold

                                ${typeInfo.badgeClass}
                              `}
                            >
                              {typeInfo.icon}
                              {selectedType?.name}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-blue-50
                                  text-blue-600
                                  transition

                                  hover:bg-blue-100
                                  hover:text-blue-700

                                  active:scale-95
                                "
                                title="แก้ไข"
                              >
                                <FaEdit />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-red-50
                                  text-red-600
                                  transition

                                  hover:bg-red-100
                                  hover:text-red-700

                                  active:scale-95
                                "
                                title="ลบ"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* =====================================================
            MODAL
        ====================================================== */}

        {open && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/50
              p-4
              backdrop-blur-sm
            "
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <div
              className="
                w-full
                max-w-md
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
            >
              {/* Modal Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                  p-5

                  sm:p-6
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        editing
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }
                    `}
                  >
                    {editing ? <FaEdit /> : <FaPlus />}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-black">
                      {editing ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
                    </h2>

                    <p className="text-xs font-medium text-black">
                      {editing ? "แก้ไขข้อมูลหมวดหมู่" : "สร้างหมวดหมู่ใหม่"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    text-black
                    transition

                    hover:bg-gray-100
                    hover:text-red-600

                    active:scale-95
                  "
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}

              <div className="space-y-5 p-5 sm:p-6">
                {/* Type */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    ประเภท
                  </label>

                  <select
                    value={form.typeId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        typeId: e.target.value,
                      })
                    }
                    disabled={saving}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      text-sm
                      font-semibold
                      text-black
                      outline-none
                      transition

                      focus:border-green-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-green-500/10

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <option value="">เลือกประเภท</option>

                    {types.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Name */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    ชื่อหมวดหมู่
                  </label>

                  <div className="relative">
                    <FaList
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-green-600
                      "
                    />

                    <input
                      autoFocus
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSave();
                        }
                      }}
                      disabled={saving}
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-11
                        text-sm
                        font-semibold
                        text-black
                        outline-none
                        transition

                        placeholder:text-gray-500

                        focus:border-green-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-500/10

                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                      placeholder="เช่น อาหาร"
                    />
                  </div>
                </div>

                {/* Buttons */}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={saving}
                    className="
                      flex
                      min-h-[48px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-black
                      transition

                      hover:bg-gray-50

                      active:scale-[0.98]

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <FaTimes />
                    ยกเลิก
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="
                      flex
                      min-h-[48px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-green-600
                      to-emerald-600
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      shadow-green-500/20
                      transition

                      hover:from-green-700
                      hover:to-emerald-700

                      active:scale-[0.98]

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <FaSave />

                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
