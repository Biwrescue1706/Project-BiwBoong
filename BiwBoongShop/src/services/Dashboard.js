
// src/services/Dashboard.js

const backendURL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${backendURL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      (typeof data === 'object' &&
        data !== null &&
        (data.message || data.error)) ||
      `เกิดข้อผิดพลาด (${response.status})`
    );
  }

  return data;
}

// ดึงรายการอุปกรณ์ทั้งหมด
export async function getEquipments() {
  const data = await apiRequest('/equipments/getall');

  if (!Array.isArray(data)) {
    throw new Error('รูปแบบข้อมูลอุปกรณ์ไม่ถูกต้อง');
  }

  return [...data].sort((a, b) =>
    String(a.EName ?? '').localeCompare(
      String(b.EName ?? ''),
      'th'
    )
  );
}

// ดึงข้อมูลอุปกรณ์ตามรหัส
export async function getEquipmentById(id) {
  return apiRequest(
    `/equipments/getall/${encodeURIComponent(id)}`
  );
}

// เพิ่มอุปกรณ์
export async function createEquipment(EName, Total) {
  return apiRequest('/equipments/getall/create', {
    method: 'POST',
    body: JSON.stringify({
      EName,
      Total: Number(Total),
    }),
  });
}

// แก้ไขอุปกรณ์
export async function updateEquipment(id, EName, Total) {
  return apiRequest(
    `/equipments/getall/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        EName,
        Total: Number(Total),
      }),
    }
  );
}

// ลบอุปกรณ์
export async function deleteEquipment(id) {
  return apiRequest(
    `/equipments/getall/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  );
}
