document.addEventListener('DOMContentLoaded', async () => {
  await checkLogin();       // ตรวจสอบว่า login อยู่ไหม
  loadEquipments();   // โหลดรายการอุปกรณ์
  // ผูก event ปุ่มเพิ่มอุปกรณ์ (ถ้ามี)
  document.getElementById('addEquipmentBtn')?.addEventListener('click', addEquipment);
});

// โหลดรายการอุปกรณ์และแสดงในตาราง
async function loadEquipments() {
  try {
    const res = await fetch(`${backendURL}/equipments/getall`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');

    const equipments = await res.json();

    equipments.sort((a, b) => a.EName.localeCompare(b.EName, 'th', { sensitivity: 'base' }));

    const table = document.getElementById('equipmentTableBody');
    table.innerHTML = '';

    equipments.forEach((e, index) => {
      table.innerHTML += `
        <tr>
          <td data-label="ลำดับ">${index + 1}</td>
          <td data-label="ชื่อ">${e.EName}</td>
          <td data-label="ทั้งหมด">${e.Total}</td>
          <td data-label="เหลือ">${e.Available}</td>
      <td data-label="แก้ไข">
        <button
          onclick="editEquipment('${e.EID}')"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
          title="แก้ไข"
        >
          <i class="fas fa-edit"></i>
        </button>
      </td>

      <td data-label="ลบ">
        <button
          onclick="deleteEquipment('${e.EID}')"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 hover:text-red-800"
          title="ลบ"
        >
          <i class="fas fa-trash"></i>
        </button>
      </td>
        </tr>
      `;
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'โหลดข้อมูลอุปกรณ์ล้มเหลว',
      text: err.message,
    });
  }
}

// ฟังก์ชันเพิ่มอุปกรณ์
async function addEquipment() {
  const { value: formValues } = await Swal.fire({
    title: 'เพิ่มอุปกรณ์ใหม่',
    html:
      '<input id="ename" class="swal2-input" placeholder="ชื่ออุปกรณ์">' +
      '<input id="etotal" type="number" min="1" class="swal2-input" placeholder="จำนวนทั้งหมด">',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    preConfirm: () => {
      const name = document.getElementById('ename').value.trim();
      const total = parseInt(document.getElementById('etotal').value);
      if (!name || isNaN(total) || total <= 0) {
        Swal.showValidationMessage('กรุณากรอกชื่อและจำนวนที่ถูกต้อง');
        return;
      }
      return { EName: name, Total: total };
    }
  });

  if (!formValues) return;

  try {
    const res = await fetch(`${backendURL}/equipments/getall/create`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'เพิ่มอุปกรณ์สำเร็จ',
        timer: 1500,
        showConfirmButton: false,
      });
      loadEquipments();
    } else {
      const errorData = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorData.message || 'ไม่สามารถเพิ่มอุปกรณ์ได้',
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
    });
  }
}

// ฟังก์ชันลบอุปกรณ์
async function deleteEquipment(id) {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบอุปกรณ์นี้ใช่หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`${backendURL}/equipments/getall/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ',
        timer: 1500,
        showConfirmButton: false,
      });
      loadEquipments();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลได้',
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
    });
  }
}

// ฟังก์ชันแก้ไขอุปกรณ์
async function editEquipment(id) {
  try {
    const res = await fetch(`${backendURL}/equipments/getall/${id}`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลอุปกรณ์');

    const equipment = await res.json();

    const { value: formValues } = await Swal.fire({
      title: 'แก้ไขอุปกรณ์',
      html:
        `<input id="ename" class="swal2-input" placeholder="ชื่ออุปกรณ์" value="${equipment.EName}">` +
        `<input id="etotal" type="number" min="1" class="swal2-input" placeholder="จำนวนทั้งหมด" value="${equipment.Total}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        const name = document.getElementById('ename').value.trim();
        const total = parseInt(document.getElementById('etotal').value);
        if (!name || isNaN(total) || total <= 0) {
          Swal.showValidationMessage('กรุณากรอกชื่อและจำนวนที่ถูกต้อง');
          return;
        }
        return { EName: name, Total: total };
      }
    });

    if (!formValues) return;

    const updateRes = await fetch(`${backendURL}/equipments/getall/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    });

    if (updateRes.ok) {
      Swal.fire({
        icon: 'success',
        title: 'อัปเดตสำเร็จ',
        timer: 1500,
        showConfirmButton: false,
      });
      loadEquipments();
    } else {
      const errData = await updateRes.json();
      Swal.fire({
        icon: 'error',
        title: 'อัปเดตไม่สำเร็จ',
        text: errData.message || 'ไม่สามารถอัปเดตอุปกรณ์ได้',
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
    });
  }
}
