document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('resetUser');
  if (!username) {
    Swal.fire({
      icon: 'error',
      title: 'ไม่พบข้อมูลผู้ใช้',
      text: 'กรุณาทำขั้นตอนลืมรหัสผ่านใหม่อีกครั้ง',
    }).then(() => {
      window.location.href = 'forgotPassword.html';
    });
    return;
  }

  const usernameInput = document.getElementById('usernameInput');
  if (usernameInput) {
    usernameInput.value = username;
  }

  const form = document.getElementById('resetPasswordForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
      Swal.fire('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('ผิดพลาด', 'รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกัน', 'error');
      return;
    }

    try {
      const res = await fetch(`${backendURL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('สำเร็จ', 'เปลี่ยนรหัสผ่านสำเร็จ', 'success').then(() => {
          localStorage.removeItem('resetUser');
          window.location.href = 'index.html'; // ไปหน้า login
        });
      } else {
        Swal.fire('ผิดพลาด', data.message || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
  });
});
