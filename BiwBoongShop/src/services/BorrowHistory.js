const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

async function request(endpoint, options = {}) {
    if (!API_BASE_URL) {
        throw new Error('ไม่พบ VITE_API_URL ในไฟล์ .env');
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            credentials: 'include',
            ...options,
            headers: {
                Accept: 'application/json',
                ...options.headers,
            },
        }
    );

    const contentType =
        response.headers.get('content-type') || '';

    const result = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(
            typeof result === 'string'
                ? result || `HTTP ${response.status}`
                : result?.message ||
                result?.error ||
                `HTTP ${response.status}`
        );
    }

    return result;
}

export async function getBorrowHistory() {
    const data = await request('/borrows/getall');

    return Array.isArray(data?.borrows)
        ? data.borrows
        : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
                ? data
                : [];
}

export async function getReturnHistory() {
    const data = await request('/returns/getall');

    return Array.isArray(data?.returns)
        ? data.returns
        : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
                ? data
                : [];
}