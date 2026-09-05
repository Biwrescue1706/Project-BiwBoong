
// ดักจับการ submit ฟอร์ม login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  try {
    // เรียกฟังก์ชัน login ใน auth.js
    await login(username, password);

    // ดึงข้อมูล user profile เพื่อตรวจสอบ token
    const user = await fetchUserProfile();

    // แสดง popup แจ้ง success
    Swal.fire({
      icon: 'success',
      title: `ยินดีต้อนรับ ${user.name}`,
      timer: 1000,
      showConfirmButton: false,
    });

    // รอให้ popup แสดงสักครู่ก่อน redirect
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);

  } catch (error) {
    // ถ้า login หรือ fetch profile ล้มเหลว แจ้ง error
    Swal.fire({
      icon: 'error',
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      text: error.message || 'เกิดข้อผิดพลาด',
    });
  }
});