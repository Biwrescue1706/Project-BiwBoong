import { useEffect, useState } from "react";
import api from "../api/axios";
import { errorAlert, successAlert } from "../utils/alert";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaSave,
  FaUserCircle,
  FaAddressCard,
} from "react-icons/fa";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    prefix: "",
    firstName: "",
    lastName: "",
    phone: "",
    citizenId: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/profile");

      const user = res.data.user;

      setForm({
        username: user?.username || "",
        email: user?.email || "",
        prefix: user?.prefix || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        citizenId: user?.citizenId || "",
      });
    } catch (err) {
      errorAlert(
        err.response?.data?.message || "ไม่สามารถโหลดข้อมูลส่วนตัวได้",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    try {
      setSaving(true);

      await api.put("/users/profile", {
        email: form.email,
        prefix: form.prefix,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        citizenId: form.citizenId,
      });

      successAlert("บันทึกข้อมูลส่วนตัวสำเร็จ");

      await loadProfile();
    } catch (err) {
      errorAlert(err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50/60">
        <div className="flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-green-100" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-600" />

            <FaUserCircle className="text-xl text-green-600" />
          </div>

          <p className="mt-5 text-sm font-semibold text-black">
            กำลังโหลดข้อมูล...
          </p>

          <p className="mt-1 text-xs text-black">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // AVATAR
  // =========================================================

  const avatar = form.firstName?.charAt(0) || form.username?.charAt(0) || "U";

  const fullName =
    `${form.prefix || ""}${form.firstName || ""} ${form.lastName || ""}`.trim();

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
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
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
              <FaUser />
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
                ข้อมูลส่วนตัว
              </h1>

              <p className="mt-1 text-sm text-white sm:text-base">
                จัดการข้อมูลส่วนตัวของคุณ
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROFILE CARD
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-100
            bg-white
            shadow-sm
          "
        >
          {/* ===================================================
              PROFILE HEADER
          ==================================================== */}

          <div className="relative overflow-hidden border-b border-gray-100 p-5 sm:p-6 md:p-7">
            {/* Background */}
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-green-50 blur-2xl" />

            <div className="relative flex flex-col items-center gap-4 sm:flex-row">
              {/* Avatar */}

              <div className="relative">
                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gradient-to-br
                    from-green-500
                    to-emerald-600
                    text-3xl
                    font-extrabold
                    text-white
                    shadow-lg
                    shadow-green-500/20

                    sm:h-24
                    sm:w-24
                    sm:text-4xl
                  "
                >
                  {avatar.toUpperCase()}
                </div>

                <div
                  className="
                    absolute
                    -bottom-1
                    -right-1
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-white
                    bg-green-500
                  "
                />
              </div>

              {/* User Info */}

              <div className="min-w-0 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-black">
                  Profile
                </p>

                <h2
                  className="
                    mt-1
                    truncate
                    text-xl
                    font-extrabold
                    text-black

                    sm:text-2xl
                  "
                >
                  {fullName || "ผู้ใช้งาน"}
                </h2>

                <p className="mt-1 text-sm font-medium text-black">
                  @{form.username || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM BODY
          ==================================================== */}

          <div className="p-5 sm:p-6 md:p-7">
            {/* Account Information */}

            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FaAddressCard />
                </div>

                <div>
                  <h3 className="text-base font-bold text-black sm:text-lg">
                    ข้อมูลบัญชี
                  </h3>

                  <p className="text-xs font-medium text-black sm:text-sm">
                    ข้อมูลสำหรับใช้งานในระบบ
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Username */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    Username
                  </label>

                  <div className="relative">
                    <FaUser
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-black
                      "
                    />

                    <input
                      type="text"
                      value={form.username}
                      disabled
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-100
                        px-11
                        text-sm
                        font-semibold
                        text-black
                        outline-none
                      "
                    />
                  </div>

                  <p className="mt-1.5 text-xs font-medium text-black">
                    Username ไม่สามารถเปลี่ยนได้
                  </p>
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    อีเมล
                  </label>

                  <div className="relative">
                    <FaEnvelope
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-green-600
                      "
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-11
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
              </div>
            </div>

            {/* Personal Information */}

            <div className="border-t border-gray-100 pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaUser />
                </div>

                <div>
                  <h3 className="text-base font-bold text-black sm:text-lg">
                    ข้อมูลส่วนตัว
                  </h3>

                  <p className="text-xs font-medium text-black sm:text-sm">
                    ข้อมูลส่วนบุคคลของคุณ
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Prefix */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    คำนำหน้า
                  </label>

                  <select
                    name="prefix"
                    value={form.prefix}
                    onChange={handleChange}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
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
                  >
                    <option value="">เลือกคำนำหน้า</option>

                    <option value="นาย">นาย</option>

                    <option value="นาง">นาง</option>

                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>

                {/* First Name */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    ชื่อ
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
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

                {/* Last Name */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    นามสกุล
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
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

                {/* Phone */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-black">
                    เบอร์โทรศัพท์
                  </label>

                  <div className="relative">
                    <FaPhone
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-green-600
                      "
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                      inputMode="numeric"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-11
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

                {/* Citizen ID */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-black">
                    เลขบัตรประชาชน
                  </label>

                  <div className="relative">
                    <FaIdCard
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-green-600
                      "
                    />

                    <input
                      type="text"
                      name="citizenId"
                      value={form.citizenId}
                      onChange={handleChange}
                      maxLength={13}
                      inputMode="numeric"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-11
                        text-sm
                        font-medium
                        tracking-wide
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

                  <p className="mt-1.5 text-xs font-medium text-black">
                    กรุณาตรวจสอบเลขบัตรประชาชนให้ถูกต้องก่อนบันทึก
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              FOOTER / SAVE
          ==================================================== */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-gray-100
              bg-gray-50
              p-5

              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:p-6
            "
          >
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-black">
                บันทึกข้อมูลส่วนตัว
              </p>

              <p className="mt-0.5 text-xs font-medium text-black">
                ตรวจสอบข้อมูลก่อนกดบันทึก
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="
                group
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-green-600
                to-emerald-600
                px-6
                py-3
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

                sm:w-auto
              "
            >
              <FaSave className="transition-transform group-hover:scale-110" />

              {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>

        {/* =====================================================
            INFORMATION
        ====================================================== */}

        <div className="mt-4 rounded-2xl border border-green-100 bg-green-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaUser />
            </div>

            <div>
              <h3 className="text-sm font-bold text-black sm:text-base">
                ข้อมูลบัญชีของคุณ
              </h3>

              <p className="mt-1 text-xs font-medium leading-5 text-black sm:text-sm">
                ข้อมูลที่แก้ไขจะถูกนำไปใช้กับบัญชีของคุณ
                และแสดงในระบบรายรับรายจ่าย
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
