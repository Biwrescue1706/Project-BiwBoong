
document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();
    loadEquipments();
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  if (password !== passwordConfirm) {
    Swal.fire({
      icon: 'error',
      title: 'รหัสผ่านไม่ตรงกัน',
    });
    return;
  }

  const payload = { name };
  if (password) {
    payload.password = password;
  }

  try {
    const res = await fetch(`${backendURL}/auth/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'แก้ไขข้อมูลไม่สำเร็จ');
    }

    Swal.fire({
      icon: 'success',
      title: 'อัปเดตข้อมูลสำเร็จ',
    });

    // เคลียร์รหัสผ่านหลังบันทึก
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message,
    });
  }
});
