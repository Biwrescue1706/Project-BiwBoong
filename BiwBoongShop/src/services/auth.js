
const backendURL = import.meta.env.VITE_API_URL;

export async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  return data;
}

export async function register(username, name, password) {
  const res = await fetch(`${backendURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, name, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
  }

  return data;
}

export async function logout() {
  const res = await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'ออกจากระบบไม่สำเร็จ');
  }

  return data;
}

export async function fetchUserProfile() {
  const res = await fetch(`${backendURL}/auth/profile`, {
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'กรุณาเข้าสู่ระบบ');
  }

  return data.user;
}
