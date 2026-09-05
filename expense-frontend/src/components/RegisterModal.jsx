import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createUser, updateUser } from "../services/user.service";
import { successAlert, errorAlert } from "../utils/alert";

function RegisterModal({ open, onClose, onSuccess, editUser }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    prefix: "นาย",
    firstName: "",
    lastName: "",
    phone: "",
    citizenId: "",
    role: "user",
  });

  useEffect(() => {
    if (!editUser) return;

    setForm({
      username: editUser.username ?? "",
      email: editUser.email ?? "",
      password: "",
      prefix: editUser.prefix ?? "นาย",
      firstName: editUser.firstName ?? "",
      lastName: editUser.lastName ?? "",
      phone: editUser.phone ?? "",
      citizenId: editUser.citizenId ?? "",
      role: editUser.role ?? "user",
    });
  }, [editUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editUser) {
        const payload = {};

        Object.keys(form).forEach((key) => {
          if (key === "password") {
            if (form.password?.trim()) payload.password = form.password;
          } else if (form[key] !== (editUser[key] ?? "")) {
            payload[key] = form[key];
          }
        });

        await updateUser(editUser.id, payload);
      } else {
        await createUser(form);
      }

      successAlert(editUser ? "แก้ไขสมาชิกสำเร็จ" : "เพิ่มสมาชิกสำเร็จ");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      errorAlert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6">
        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-bold">
            {editUser ? "แก้ไขสมาชิก" : "เพิ่มสมาชิก"}
          </h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          {!editUser && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="rounded-lg border p-3"
            />
          )}

          <select
            name="prefix"
            value={form.prefix}
            onChange={handleChange}
            className="rounded-lg border p-3"
          >
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
          </select>

          <input
            name="firstName"
            placeholder="ชื่อ"
            value={form.firstName}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />
          <input
            name="lastName"
            placeholder="นามสกุล"
            value={form.lastName}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />
          <input
            name="phone"
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />
          <input
            name="citizenId"
            placeholder="เลขบัตรประชาชน"
            value={form.citizenId}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded-lg border p-3"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-5 py-2 text-white"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
