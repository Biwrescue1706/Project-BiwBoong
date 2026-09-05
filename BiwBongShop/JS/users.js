import { formatDateThai } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  await checkLogin();
  await loadUsers();

  document.getElementById("addUserBtn")?.addEventListener("click", addUser);
});

async function addUser() {
  const { value: formValues } = await Swal.fire({
    title: "เพิ่มสมาชิกใหม่",
    html:
      `<input id="reg-username" class="swal2-input" placeholder="Username">` +
      `<input id="reg-name" class="swal2-input" placeholder="ชื่อจริง">` +
      `<input id="reg-password" type="password" class="swal2-input" placeholder="รหัสผ่าน">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "เพิ่มสมาชิก",
    cancelButtonText: "ยกเลิก",
    preConfirm: () => {
      const username = document
        .getElementById("reg-username")
        .value.trim();

      const name = document
        .getElementById("reg-name")
        .value.trim();

      const password = document
        .getElementById("reg-password")
        .value.trim();

      if (!username || !name || !password) {
        Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบ");
        return false;
      }

      return {
        username,
        name,
        password,
      };
    },
  });

  if (!formValues) return;

  try {
    const res = await fetch(`${backendURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formValues),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "ไม่สามารถสมัครสมาชิกได้"
      );
    }

    await Swal.fire({
      icon: "success",
      title: "เพิ่มสมาชิกสำเร็จเรียบร้อยแล้ว",
      timer: 1500,
      showConfirmButton: false,
    });

    loadUsers();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: err.message || "ไม่สามารถเพิ่มสมาชิกได้",
    });
  }
}

async function loadUsers() {
  try {
    const res = await fetch(`${backendURL}/users/getall`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("โหลดข้อมูลผู้ใช้ล้มเหลว");
    }

    const users = await res.json();
    const tbody = document.getElementById("usersTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    users.forEach((user, index) => {
      tbody.innerHTML += `
        <tr class="border-b border-slate-200 bg-white transition hover:bg-slate-50">
          <td class="border border-slate-200 px-4 py-3">
            ${index + 1}
          </td>

          <td class="border border-slate-200 px-4 py-3">
            ${escapeHtml(user.username || "-")}
          </td>

          <td class="border border-slate-200 px-4 py-3">
            ${escapeHtml(user.name || "-")}
          </td>

          <td class="border border-slate-200 px-4 py-3">
            ${user.Created_At
          ? formatDateThai(user.Created_At)
          : "-"}
          </td>

          <td class="border border-slate-200 px-4 py-3">
            ${user.Update_At
          ? formatDateThai(user.Update_At)
          : "-"}
          </td>

          <td class="border border-slate-200 px-4 py-3">
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 active:scale-95"
              onclick="editUser(
                '${escapeQuotes(user.UserId)}',
                '${escapeQuotes(user.username)}',
                '${escapeQuotes(user.name)}'
              )"
              title="แก้ไข"
            >
              <i class="fa-solid fa-pen"></i>
            </button>
          </td>

          <td class="border border-slate-200 px-4 py-3">
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 hover:text-red-800 active:scale-95"
              onclick="deleteUser('${escapeQuotes(user.UserId)}')"
              title="ลบ"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: err.message || "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
    });
  }
}

function escapeQuotes(str) {
  if (!str) return "";

  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

function escapeHtml(str) {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.editUser = async (
  id,
  oldUsername,
  oldName
) => {
  const { value: formValues } = await Swal.fire({
    title: "แก้ไขผู้ใช้",
    html:
      `<input id="edit-username" class="swal2-input" value="${escapeHtml(oldUsername)}" placeholder="Username">` +
      `<input id="edit-name" class="swal2-input" value="${escapeHtml(oldName)}" placeholder="ชื่อจริง">` +
      `<input id="edit-password" type="password" class="swal2-input" placeholder="รหัสผ่านใหม่ (ถ้าจะเปลี่ยน)">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "บันทึก",
    cancelButtonText: "ยกเลิก",
    preConfirm: () => {
      const username = document
        .getElementById("edit-username")
        .value.trim();

      const name = document
        .getElementById("edit-name")
        .value.trim();

      const password = document
        .getElementById("edit-password")
        .value.trim();

      if (
        username === oldUsername &&
        name === oldName &&
        !password
      ) {
        Swal.showValidationMessage(
          "คุณยังไม่ได้เปลี่ยนข้อมูลใด ๆ"
        );
        return false;
      }

      if (!username || !name) {
        Swal.showValidationMessage(
          "กรุณากรอก Username และชื่อให้ครบ"
        );
        return false;
      }

      const updateData = {};

      if (username !== oldUsername) {
        updateData.username = username;
      }

      if (name !== oldName) {
        updateData.name = name;
      }

      if (password) {
        updateData.password = password;
      }

      return updateData;
    },
  });

  if (!formValues) return;

  try {
    const res = await fetch(
      `${backendURL}/users/getall/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formValues),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "แก้ไขไม่สำเร็จ"
      );
    }

    await Swal.fire({
      icon: "success",
      title: "ข้อมูลถูกอัปเดตแล้ว",
      timer: 1500,
      showConfirmButton: false,
    });

    loadUsers();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: err.message || "ไม่สามารถแก้ไขข้อมูลได้",
    });
  }
};

window.deleteUser = async (id) => {
  const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: "คุณต้องการลบผู้ใช้นี้จริงหรือ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(
      `${backendURL}/users/getall/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "ลบไม่สำเร็จ"
      );
    }

    await Swal.fire({
      icon: "success",
      title: "ลบผู้ใช้สำเร็จ",
      timer: 1500,
      showConfirmButton: false,
    });

    loadUsers();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: err.message || "ไม่สามารถลบผู้ใช้ได้",
    });
  }
};