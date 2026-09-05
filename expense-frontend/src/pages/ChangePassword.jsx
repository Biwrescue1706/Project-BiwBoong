import { useState } from "react";
import api from "../api/axios";
import { errorAlert, successAlert } from "../utils/alert";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

// Password Input
function PasswordInput({
  label,
  name,
  value,
  show,
  setShow,
  handleChange,
  placeholder = "กรอกรหัสผ่าน",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-black">{label}</label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-green-50 text-green-600">
          <FaLock />
        </div>

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
          placeholder={placeholder}
          className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-16 pr-14 text-sm font-medium text-black outline-none transition-all placeholder:text-gray-500 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-black transition hover:bg-gray-100 hover:text-green-600 active:scale-95"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return errorAlert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    if (form.newPassword.length < 6) {
      return errorAlert("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
    }

    if (form.newPassword !== form.confirmPassword) {
      return errorAlert("ยืนยันรหัสผ่านไม่ตรงกัน");
    }

    if (form.currentPassword === form.newPassword) {
      return errorAlert("รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม");
    }

    try {
      setSaving(true);

      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      await successAlert("เปลี่ยนรหัสผ่านสำเร็จ");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);

      // เปลี่ยนรหัสผ่านแล้ว Logout
      try {
        await api.post("/auth/logout");
      } catch (logoutError) {
        console.error("Logout error:", logoutError);
      }

      localStorage.removeItem("token");

      window.location.href = "/";
    } catch (err) {
      errorAlert(err.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setSaving(false);
    }
  };

  // Password Status
  const hasNewPassword = form.newPassword.length > 0;
  const passwordLength = form.newPassword.length >= 6;
  const differentPassword =
    hasNewPassword && form.currentPassword !== form.newPassword;
  const passwordMatch =
    hasNewPassword && form.newPassword === form.confirmPassword;

  return (
    <div className="min-h-full bg-slate-50/60 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 text-white shadow-lg shadow-green-600/10 sm:p-6 md:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur-sm sm:h-14 sm:w-14 sm:text-2xl">
              <FaLock />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                เปลี่ยนรหัสผ่าน
              </h1>

              <p className="mt-1 text-sm text-white sm:text-base">
                เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบ
              </p>
            </div>
          </div>
        </section>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Security Header */}
          <div className="border-b border-gray-100 p-5 sm:p-6 md:p-7">
            <div className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50/70 p-4 sm:p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-500 text-xl text-white shadow-md shadow-green-500/20">
                <FaShieldAlt />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-black sm:text-lg">
                  รักษาความปลอดภัยบัญชี
                </h2>

                <p className="mt-1 text-xs font-medium leading-5 text-black sm:text-sm">
                  แนะนำให้ใช้รหัสผ่านที่คาดเดาได้ยาก
                  และไม่ควรใช้รหัสผ่านเดียวกับระบบอื่น
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-7">
            <div className="space-y-5">
              {/* Current Password */}
              <PasswordInput
                label="รหัสผ่านเดิม"
                name="currentPassword"
                value={form.currentPassword}
                show={showCurrent}
                setShow={setShowCurrent}
                handleChange={handleChange}
                placeholder="กรอกรหัสผ่านเดิม"
              />

              {/* New Password */}
              <PasswordInput
                label="รหัสผ่านใหม่"
                name="newPassword"
                value={form.newPassword}
                show={showNew}
                setShow={setShowNew}
                handleChange={handleChange}
                placeholder="กรอกรหัสผ่านใหม่"
              />

              {/* Password Status */}
              {hasNewPassword && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-3 text-xs font-bold text-black">
                    ตรวจสอบรหัสผ่าน
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle
                        className={
                          passwordLength ? "text-green-500" : "text-gray-400"
                        }
                      />

                      <span
                        className={`text-xs font-semibold ${passwordLength ? "text-green-600" : "text-black"
                          }`}
                      >
                        อย่างน้อย 6 ตัว
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCheckCircle
                        className={
                          differentPassword ? "text-green-500" : "text-gray-400"
                        }
                      />

                      <span
                        className={`text-xs font-semibold ${differentPassword ? "text-green-600" : "text-black"
                          }`}
                      >
                        ไม่เหมือนรหัสเดิม
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCheckCircle
                        className={
                          passwordMatch ? "text-green-500" : "text-gray-400"
                        }
                      />

                      <span
                        className={`text-xs font-semibold ${passwordMatch ? "text-green-600" : "text-black"
                          }`}
                      >
                        รหัสตรงกัน
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <PasswordInput
                label="ยืนยันรหัสผ่านใหม่"
                name="confirmPassword"
                value={form.confirmPassword}
                show={showConfirm}
                setShow={setShowConfirm}
                handleChange={handleChange}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />

              {/* Requirements */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                    <FaKey />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-black">
                      ข้อกำหนดรหัสผ่าน
                    </p>

                    <p className="text-xs font-medium text-black">
                      เพื่อความปลอดภัยของบัญชี
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle
                      className={
                        passwordLength ? "text-green-500" : "text-gray-400"
                      }
                    />

                    <span className="text-xs font-medium text-black sm:text-sm">
                      ต้องมีอย่างน้อย 6 ตัวอักษร
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCheckCircle
                      className={
                        passwordMatch ? "text-green-500" : "text-gray-400"
                      }
                    />

                    <span className="text-xs font-medium text-black sm:text-sm">
                      รหัสผ่านใหม่ต้องตรงกับการยืนยัน
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCheckCircle
                      className={
                        differentPassword ? "text-green-500" : "text-gray-400"
                      }
                    />

                    <span className="text-xs font-medium text-black sm:text-sm">
                      รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-gray-400" />

                    <span className="text-xs font-medium text-black sm:text-sm">
                      ไม่ควรใช้รหัสผ่านเดียวกับระบบอื่น
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-black">
                  พร้อมเปลี่ยนรหัสผ่าน?
                </p>

                <p className="mt-0.5 text-xs font-medium text-black">
                  ตรวจสอบข้อมูลก่อนกดยืนยัน
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="group flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <FaKey className="transition-transform group-hover:rotate-12" />
                {saving ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
              </button>
            </div>
          </form>
        </div>

        {/* Security Information */}
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaShieldAlt />
            </div>

            <div>
              <h3 className="text-sm font-bold text-black sm:text-base">
                คำแนะนำด้านความปลอดภัย
              </h3>

              <p className="mt-1 text-xs font-medium leading-5 text-black sm:text-sm">
                อย่าเปิดเผยรหัสผ่านให้ผู้อื่นทราบ
                และควรเปลี่ยนรหัสผ่านทันทีหากสงสัยว่าบัญชีอาจถูกเข้าถึงโดยไม่ได้รับอนุญาต
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
