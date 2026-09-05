document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  if (!username) {
    Swal.fire('แจ้งเตือน', 'กรุณากรอกชื่อผู้ใช้', 'warning');
    return;
  }

  try {
    const res = await fetch(`${backendURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('resetUser', username); // เก็บ username ไว้ใช้ใน resetPassword.html
      Swal.fire('สำเร็จ', data.message, 'success').then(() => {
        window.location.href = '/resetPassword';
      });window.location.href = '/resetPassword';

    } else {
      Swal.fire('ผิดพลาด', data.message || 'เกิดข้อผิดพลาด', 'error');
    }
  } catch (err) {
    Swal.fire('ผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'error');
  }
});