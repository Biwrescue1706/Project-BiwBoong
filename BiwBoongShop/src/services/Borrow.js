
// src/services/Borrow.js
const backendURL = import.meta.env.VITE_API_URL;

// โหลดรายการอุปกรณ์ทั้งหมด
export async function getBorrowEquipments({ signal } = {}) {
    const response = await fetch(`${backendURL}/equipments/getall`, {
        method: 'GET',
        credentials: 'include',
        signal,
    });

    if (!response.ok) {
        throw new Error(
            response.status === 401
                ? 'กรุณาเข้าสู่ระบบใหม่'
                : 'โหลดข้อมูลอุปกรณ์ไม่สำเร็จ'
        );
    }

    const data = await response.json();

    const equipments = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
            ? data.items
            : [];

    return equipments.sort((a, b) => {
        const availableA = Number(a.Available ?? 0);
        const availableB = Number(b.Available ?? 0);

        if (availableA > 0 && availableB === 0) return -1;
        if (availableA === 0 && availableB > 0) return 1;

        return String(a.EName ?? '').localeCompare(
            String(b.EName ?? ''),
            'th',
            { sensitivity: 'base' }
        );
    });
}

// ส่งคำขอยืมอุปกรณ์
export async function borrowEquipment({
    equipmentId,
    equipmentName,
    quantity,
    borrowerName,
}) {
    const payload = {
        EquipmentID: equipmentId,
        EName: equipmentName,
        Quantity: quantity,
        names: borrowerName,
    };

    let response = await fetch(`${backendURL}/borrows/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    // ใช้เส้นทางสำรองตามระบบเดิม เมื่อเส้นทางแรกตอบกลับ 404
    if (response.status === 404) {
        response = await fetch(`${backendURL}/borrows/getall/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });
    }

    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { message: text };
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            'ยืมอุปกรณ์ไม่สำเร็จ'
        );
    }

    return data;
}
