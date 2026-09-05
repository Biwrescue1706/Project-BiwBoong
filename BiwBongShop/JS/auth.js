const backendURL = 'https://biwbongshopbackend.onrender.com';

// ฟังก์ชัน login
async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  return data;
}

// ฟังก์ชัน register
async function register(username, name, password) {
  const res = await fetch(`${backendURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, name, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
  return data;
}

// ฟังก์ชัน logout
async function logout() {
  const res = await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'ออกจากระบบไม่สำเร็จ');
  return data;
}

// ฟังก์ชันดึงข้อมูลโปรไฟล์
async function fetchUserProfile() {
  const res = await fetch(`${backendURL}/auth/profile`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Unauthorized');
  }
  const data = await res.json();
  return data.user;
}

// ---------- UI: แสดงต้อนรับ ----------
function setWelcome(user) {
  const el = document.getElementById('welcome');
  if (!el) return;
  const display =
    user?.name ??
    user?.Name ??
    user?.username ??
    user?.Username ??
    'ผู้ใช้งาน';
  el.textContent = `ยินดีต้อนรับ ${display}`;
}

// ฟังก์ชันตรวจสอบสถานะ login และ redirect ถ้าไม่ login
async function checkLogin() {
  try {
    const user = await fetchUserProfile();

    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = user.Username || user.name || 'ไม่มีชื่อ';
    }

    // สำคัญ: อัปเดต #welcome ที่ navbar
    setWelcome(user);
    return user;
  } catch (err) {
    console.warn('ยังไม่ได้เข้าสู่ระบบ:', err.message);
    Swal.fire({
      icon: 'error',
      title: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = '/index';
    });
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirm = document.getElementById('toggleConfirmPassword');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.textContent = isHidden ? '👁️' : '🙈';
    });
  }

  if (toggleConfirm && confirmInput) {
    toggleConfirm.addEventListener('click', () => {
      const isHidden = confirmInput.type === 'password';
      confirmInput.type = isHidden ? 'text' : 'password';
      toggleConfirm.textContent = isHidden ? '👁️' : '🙈';
    });
  }

});