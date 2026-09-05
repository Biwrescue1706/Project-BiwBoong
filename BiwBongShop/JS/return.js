document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();
    loadReturns();
});

async function loadReturns() {
  try {
    const res = await fetch(`${backendURL}/returns/getall`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลการคืนอุปกรณ์ได้');

    const { returns } = await res.json();  // ✅ แก้ตรงนี้
    const tbody = document.getElementById('returnsTableBody');
    tbody.innerHTML = '';

    returns.forEach((r, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td data-label="ลำดับ">${index + 1}</td>
        <td data-label="ชื่อผู้ดำเนินการ">${r.name || '-'}</td>
        <td data-label="ชื่อผู้ยืม	">${r.names || '-'}</td>
        <td data-label="ชื่ออุปกรณ์">${r.Ename || '-'}</td>
        <td data-label="จำนวนที่คืน	" >${r.Quantity || '-'}</td>
        <td data-label="วันที่คืน">${formatDateThai(r.ReturnDate) ||'-'}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err.message);
  }
}


// helper แปลงวันที่ให้อ่านง่าย
function formatDateThai(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

