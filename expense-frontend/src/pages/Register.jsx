import { useEffect, useState } from "react";

import {
  FaPlus,
  FaUsers,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
} from "react-icons/fa";

import { successAlert, errorAlert, confirmDelete } from "../utils/alert";

import RegisterModal from "../components/RegisterModal";

import { getUsers, deleteUser } from "../services/user.service";

function Register() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // =========================================================
  // LOAD USERS
  // =========================================================

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data || []);
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลสมาชิกได้");
    }
  };

  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = () => {
    setEditUser(null);
    setOpenModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenModal(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);

      successAlert("ลบสมาชิกสำเร็จ");

      await loadUsers();
    } catch (err) {
      errorAlert(err.response?.data?.message || "ไม่สามารถลบสมาชิกได้");
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredUsers = users.filter((user) => {
    const key = keyword.trim().toLowerCase();

    if (!key) return true;

    return (
      user.fullName?.toLowerCase().includes(key) ||
      user.username?.toLowerCase().includes(key) ||
      user.email?.toLowerCase().includes(key) ||
      user.role?.toLowerCase().includes(key)
    );
  });

  // =========================================================
  // COUNTS
  // =========================================================

  const adminCount = users.filter((user) => user.role === "admin").length;

  const userCount = users.filter((user) => user.role !== "admin").length;

  // =========================================================
  // USER INITIAL
  // =========================================================

  const getInitial = (user) => {
    const name = user.fullName || user.username || "U";

    return name.trim().charAt(0).toUpperCase();
  };

  // =========================================================
  // ROLE INFO
  // =========================================================

  const getRoleInfo = (role) => {
    if (role === "admin") {
      return {
        icon: <FaUserShield />,
        label: "Admin",
        badge: "border-red-200 bg-red-100 text-red-700",
        iconBox: "bg-red-100 text-red-600",
      };
    }

    return {
      icon: <FaUser />,
      label: role || "User",
      badge: "border-green-200 bg-green-100 text-green-700",
      iconBox: "bg-green-100 text-green-600",
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
      <div className="mx-auto w-full max-w-6xl">
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
          {/* Decoration */}

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
            {/* Title */}

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
                <FaUsers />
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
                  สมาชิกทั้งหมด
                </h1>

                <p className="mt-1 text-sm text-white sm:text-base">
                  จัดการข้อมูลสมาชิกและผู้ใช้งานระบบ
                </p>
              </div>
            </div>

            {/* Add */}

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
              <FaPlus
                className="
                  transition-transform
                  group-hover:rotate-90
                "
              />
              เพิ่มสมาชิก
            </button>
          </div>
        </section>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <section
          className="
            mb-5
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-3
          "
        >
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
                  สมาชิกทั้งหมด
                </p>

                <p className="mt-2 text-3xl font-extrabold text-black">
                  {users.length}
                </p>

                <p className="mt-1 text-xs font-medium text-black">คน</p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                "
              >
                <FaUsers />
              </div>
            </div>
          </div>

          {/* Admin */}

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
                <p className="text-sm font-semibold text-black">ผู้ดูแลระบบ</p>

                <p className="mt-2 text-3xl font-extrabold text-red-600">
                  {adminCount}
                </p>

                <p className="mt-1 text-xs font-medium text-black">Admin</p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-100
                  text-red-600
                "
              >
                <FaUserShield />
              </div>
            </div>
          </div>

          {/* User */}

          <div
            className="
              rounded-2xl
              border
              border-blue-100
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-black">ผู้ใช้งาน</p>

                <p className="mt-2 text-3xl font-extrabold text-blue-600">
                  {userCount}
                </p>

                <p className="mt-1 text-xs font-medium text-black">User</p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                "
              >
                <FaUser />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
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
          <div
            className="
              flex
              flex-col
              gap-4

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2 className="text-base font-bold text-black">ค้นหาสมาชิก</h2>

              <p className="mt-1 text-xs font-medium text-black sm:text-sm">
                ค้นหาจากชื่อ Username อีเมล หรือสิทธิ์
              </p>
            </div>

            <div className="relative w-full sm:max-w-md">
              <FaSearch
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-green-600
                "
              />

              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ค้นหาสมาชิก..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-11
                  pr-4
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
            </div>
          </div>
        </section>

        {/* =====================================================
            MEMBER LIST
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
          {/* List Header */}

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
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                "
              >
                <FaUsers />
              </div>

              <div>
                <h2 className="text-lg font-bold text-black">รายชื่อสมาชิก</h2>

                <p className="text-xs font-medium text-black sm:text-sm">
                  รายการผู้ใช้งานในระบบ
                </p>
              </div>
            </div>

            <div className="text-sm font-semibold text-black">
              แสดง{" "}
              <span className="text-green-600">{filteredUsers.length}</span> จาก{" "}
              {users.length} คน
            </div>
          </div>

          {/* ===================================================
              EMPTY
          ==================================================== */}

          {filteredUsers.length === 0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-5
                py-16
                text-center
              "
            >
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
                {keyword ? <FaSearch /> : <FaUsers />}
              </div>

              <h3 className="mt-5 text-base font-bold text-black">
                {keyword ? "ไม่พบสมาชิก" : "ยังไม่มีสมาชิก"}
              </h3>

              <p className="mt-1 max-w-sm text-sm font-medium text-black">
                {keyword
                  ? "ลองเปลี่ยนคำค้นหาแล้วค้นหาใหม่อีกครั้ง"
                  : "เริ่มต้นด้วยการเพิ่มสมาชิกเข้าสู่ระบบ"}
              </p>

              {!keyword && (
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
                  เพิ่มสมาชิก
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =================================================
                  MOBILE CARDS
              ================================================== */}

              <div
                className="
                  space-y-3
                  p-4

                  md:hidden
                "
              >
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);

                  return (
                    <div
                      key={user.id}
                      className="
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        p-4
                        shadow-sm
                      "
                    >
                      {/* User */}

                      <div className="flex items-start gap-3">
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-green-500
                            to-emerald-600
                            text-base
                            font-extrabold
                            text-white
                            shadow-sm
                          "
                        >
                          {getInitial(user)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <h3 className="truncate text-base font-bold text-black">
                              {user.fullName || "-"}
                            </h3>

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[11px]
                                font-bold

                                ${roleInfo.badge}
                              `}
                            >
                              {roleInfo.icon}
                              {roleInfo.label}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm font-medium text-black">
                            @{user.username || "-"}
                          </p>

                          <p className="mt-1 truncate text-xs font-medium text-black">
                            {user.email || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}

                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-2
                          gap-2
                          border-t
                          border-gray-100
                          pt-3
                        "
                      >
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
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
                          onClick={() => handleDelete(user.id)}
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

              <div
                className="
                  hidden
                  overflow-x-auto

                  md:block
                "
              >
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr
                      className="
                        border-b
                        border-gray-200
                        bg-gray-50
                      "
                    >
                      <th className="px-6 py-4 text-left text-xs font-bold text-black">
                        สมาชิก
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold text-black">
                        Username
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold text-black">
                        Email
                      </th>

                      <th className="w-32 px-6 py-4 text-center text-xs font-bold text-black">
                        สิทธิ์
                      </th>

                      <th className="w-28 px-6 py-4 text-center text-xs font-bold text-black">
                        แก้ไข
                      </th>

                      <th className="w-28 px-6 py-4 text-center text-xs font-bold text-black">
                        ลบ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => {
                      const roleInfo = getRoleInfo(user.role);

                      return (
                        <tr
                          key={user.id}
                          className="
                            border-b
                            border-gray-100
                            transition-colors

                            hover:bg-green-50/40
                          "
                        >
                          {/* Name */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex
                                  h-10
                                  w-10
                                  flex-shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-gradient-to-br
                                  from-green-500
                                  to-emerald-600
                                  text-sm
                                  font-extrabold
                                  text-white
                                "
                              >
                                {getInitial(user)}
                              </div>

                              <div className="min-w-0">
                                <p className="font-bold text-black">
                                  {user.fullName || "-"}
                                </p>

                                <p className="text-xs font-medium text-black">
                                  สมาชิกระบบ
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Username */}

                          <td className="px-6 py-4">
                            <span className="font-medium text-black">
                              @{user.username || "-"}
                            </span>
                          </td>

                          {/* Email */}

                          <td className="px-6 py-4">
                            <span className="font-medium text-black">
                              {user.email || "-"}
                            </span>
                          </td>

                          {/* Role */}

                          <td className="px-6 py-4 text-center">
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-3
                                py-1
                                text-xs
                                font-bold

                                ${roleInfo.badge}
                              `}
                            >
                              {roleInfo.icon}
                              {roleInfo.label}
                            </span>
                          </td>

                          {/* Edit */}

                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleEdit(user)}
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

                          {/* Delete */}

                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleDelete(user.id)}
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
            REGISTER MODAL
        ====================================================== */}

        <RegisterModal
          open={openModal}
          editUser={editUser}
          onClose={() => {
            setOpenModal(false);
            setEditUser(null);
          }}
          onSuccess={async () => {
            await loadUsers();

            successAlert(editUser ? "แก้ไขสมาชิกสำเร็จ" : "เพิ่มสมาชิกสำเร็จ");
          }}
        />
      </div>
    </div>
  );
}

export default Register;
