import { useEffect, useState } from "react";

import {
  FaPlus,
  FaTags,
  FaEdit,
  FaTrash,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaSave,
} from "react-icons/fa";

import { successAlert, errorAlert, confirmDelete } from "../utils/alert";

import {
  getTypes,
  createType,
  updateType,
  deleteType,
} from "../services/type.service";

function Types() {
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTypes();
  }, []);

  // =========================================================
  // LOAD
  // =========================================================

  const loadTypes = async () => {
    try {
      const data = await getTypes();

      setTypes(data || []);
    } catch (err) {
      console.error(err);

      errorAlert(
        err.response?.data?.message ||
          err.message ||
          "ไม่สามารถโหลดข้อมูลประเภทได้",
      );
    }
  };

  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = () => {
    setEditing(null);
    setName("");
    setOpen(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    setEditing(item);
    setName(item.name);
    setOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditing(null);
    setName("");
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async () => {
    if (!name.trim()) {
      return errorAlert("กรุณากรอกชื่อประเภท");
    }

    try {
      setSaving(true);

      if (editing) {
        const result = await updateType(editing.id, {
          name: name.trim(),
        });

        setOpen(false);
        setEditing(null);
        setName("");

        await loadTypes();

        successAlert(result?.message || "แก้ไขประเภทสำเร็จ");
      } else {
        const result = await createType({
          name: name.trim(),
        });

        setOpen(false);
        setName("");

        await loadTypes();

        successAlert(result?.message || "เพิ่มประเภทสำเร็จ");
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
      const response = await deleteType(id);

      await loadTypes();

      successAlert(response?.message || "ลบประเภทสำเร็จ");
    } catch (err) {
      errorAlert(
        err.response?.data?.message || err.message || "เกิดข้อผิดพลาด",
      );
    }
  };

  // =========================================================
  // TYPE STYLE
  // =========================================================

  const getTypeInfo = (typeName) => {
    const isIncome = typeName === "รายรับ";

    if (isIncome) {
      return {
        icon: <FaArrowUp />,
        badge: "bg-green-100 text-green-700 border-green-200",
        iconBox: "bg-green-100 text-green-600",
      };
    }

    return {
      icon: <FaArrowDown />,
      badge: "bg-red-100 text-red-700 border-red-200",
      iconBox: "bg-red-100 text-red-600",
    };
  };

  return (
    <div className="min-h-full bg-slate-50/60 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
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
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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
                <FaTags />
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
                  ประเภท
                </h1>

                <p className="mt-1 text-sm text-white sm:text-base">
                  จัดการประเภทของรายการรายรับและรายจ่าย
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
              เพิ่มประเภท
            </button>
          </div>
        </section>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  ประเภททั้งหมด
                </p>

                <p className="mt-2 text-3xl font-extrabold text-black">
                  {types.length}
                </p>

                <p className="mt-1 text-xs font-medium text-black">รายการ</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FaTags />
              </div>
            </div>
          </div>

          {/* Income */}

          <div
            className="
              rounded-2xl
              border
              border-green-100
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-black">รายรับ</p>

                <p className="mt-2 text-3xl font-extrabold text-green-600">
                  {types.filter((item) => item.name === "รายรับ").length}
                </p>

                <p className="mt-1 text-xs font-medium text-black">ประเภท</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FaArrowUp />
              </div>
            </div>
          </div>

          {/* Expense */}

          <div
            className="
              rounded-2xl
              border
              border-red-100
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-black">รายจ่าย</p>

                <p className="mt-2 text-3xl font-extrabold text-red-600">
                  {types.filter((item) => item.name === "รายจ่าย").length}
                </p>

                <p className="mt-1 text-xs font-medium text-black">ประเภท</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <FaArrowDown />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LIST
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
          {/* Section Header */}

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
                <FaTags />
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">รายการประเภท</h2>

                <p className="text-xs font-medium text-black sm:text-sm">
                  จัดการประเภทที่ใช้ในระบบ
                </p>
              </div>
            </div>

            <div className="text-sm font-semibold text-black">
              ทั้งหมด <span className="text-green-600">{types.length}</span>{" "}
              รายการ
            </div>
          </div>

          {/* ===================================================
              EMPTY
          ==================================================== */}

          {types.length === 0 ? (
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
                ยังไม่มีประเภท
              </h3>

              <p className="mt-1 max-w-sm text-sm font-medium text-black">
                เริ่มต้นด้วยการเพิ่มประเภทรายรับหรือรายจ่าย
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
                เพิ่มประเภท
              </button>
            </div>
          ) : (
            <>
              {/* =================================================
                  MOBILE CARDS
              ================================================== */}

              <div className="space-y-3 p-4 md:hidden">
                {types.map((item) => {
                  const typeInfo = getTypeInfo(item.name);

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
                            ${typeInfo.iconBox}
                          `}
                        >
                          {typeInfo.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-black">
                            ประเภท
                          </p>

                          <span
                            className={`
                              mt-1
                              inline-flex
                              items-center
                              rounded-full
                              border
                              px-3
                              py-1
                              text-sm
                              font-bold

                              ${typeInfo.badge}
                            `}
                          >
                            {item.name}
                          </span>
                        </div>
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
                            bg-yellow-50
                            text-sm
                            font-bold
                            text-yellow-700
                            transition

                            hover:bg-yellow-100
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
                  TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-bold text-black">
                        ประเภท
                      </th>

                      <th className="w-32 px-6 py-4 text-center text-xs font-bold text-black">
                        แก้ไข
                      </th>

                      <th className="w-32 px-6 py-4 text-center text-xs font-bold text-black">
                        ลบ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {types.map((item) => {
                      const typeInfo = getTypeInfo(item.name);

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

                                  ${typeInfo.iconBox}
                                `}
                              >
                                {typeInfo.icon}
                              </div>

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  rounded-full
                                  border
                                  px-3
                                  py-1
                                  text-sm
                                  font-bold

                                  ${typeInfo.badge}
                                `}
                              >
                                {item.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center">
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
                                  bg-yellow-50
                                  text-yellow-600
                                  transition

                                  hover:bg-yellow-100
                                  hover:text-yellow-700

                                  active:scale-95
                                "
                                title="แก้ไข"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center">
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
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }
                    `}
                  >
                    {editing ? <FaEdit /> : <FaPlus />}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-black">
                      {editing ? "แก้ไขประเภท" : "เพิ่มประเภท"}
                    </h2>

                    <p className="text-xs font-medium text-black">
                      {editing ? "แก้ไขชื่อประเภท" : "สร้างประเภทใหม่"}
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

                    disabled:cursor-not-allowed
                  "
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}

              <div className="p-5 sm:p-6">
                <label className="mb-2 block text-sm font-bold text-black">
                  ชื่อประเภท
                </label>

                <div className="relative">
                  <FaTags
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave();
                      }
                    }}
                    disabled={saving}
                    className="
                      h-13
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
                    placeholder="เช่น รายรับ"
                  />
                </div>

                <p className="mt-2 text-xs font-medium text-black">
                  ตัวอย่าง: รายรับ หรือ รายจ่าย
                </p>

                {/* Buttons */}

                <div className="mt-6 grid grid-cols-2 gap-3">
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

export default Types;
