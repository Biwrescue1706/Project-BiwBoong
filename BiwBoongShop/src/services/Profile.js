const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
    if (!API_URL) {
        throw new Error('ไม่พบ VITE_API_URL ในไฟล์ .env');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: 'include',
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || `เกิดข้อผิดพลาด HTTP ${response.status}`
        );
    }

    return data;
}

// ==================== PROFILE ====================

// ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่เข้าสู่ระบบ
export async function getProfile() {
    const data = await request('/auth/profile');
    return data.user ?? data;
}

// แก้ไขชื่อและรหัสผ่านของโปรไฟล์ตัวเอง
export async function updateProfile({ name, password }) {
    const payload = { name: name.trim() };

    if (password) {
        payload.password = password;
    }

    return request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

// ==================== USER MANAGEMENT ====================

// โหลดรายชื่อผู้ใช้งานทั้งหมด
export async function fetchUsers() {
    const data = await request('/users/getall');

    if (Array.isArray(data)) return data;

    return data.users ?? data.items ?? data.data ?? [];
}

// เพิ่มสมาชิกใหม่
export async function createUser({ username, name, password }) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, name, password }),
    });
}

// แก้ไขข้อมูลสมาชิก
export async function updateUser(userId, payload) {
    if (userId == null || userId === '') {
        throw new Error('ไม่พบรหัสผู้ใช้งาน');
    }

    return request(
        `/users/getall/${encodeURIComponent(userId)}`,
        {
            method: 'PUT',
            body: JSON.stringify(payload),
        }
    );
}

// ลบสมาชิก
export async function deleteUser(userId) {
    if (userId == null || userId === '') {
        throw new Error('ไม่พบรหัสผู้ใช้งาน');
    }

    return request(
        `/users/getall/${encodeURIComponent(userId)}`,
        {
            method: 'DELETE',
        }
    );
}