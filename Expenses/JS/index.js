const API_BASE = "https://biwbongshopbackend.onrender.com/expenses";

/* ===== Rates (ให้ตรงกับ backend/.env) ===== */
const ELEC_RATE = 8;   // ⚡ บาท/หน่วย
const WATER_RATE = 19; // 💧 บาท/หน่วย

/* ---------- Utils ---------- */
const $ = (q, el = document) => el.querySelector(q);
const fmt = (n) => Number(n || 0).toLocaleString('th-TH');
const baht = (n) => `${fmt(n)} บาท`;

/** คืนคีย์เดือนมาตรฐาน "YYYY-MM" ไม่ว่า input จะเป็น "YYYY-MM" หรือ "YYYY-MM-25" */
function monthKey(s) {
  if (!s) return "";
  const m = String(s).match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : "";
}

/** สร้างวันที่ 25 ของเดือนจากคีย์ "YYYY-MM" (Date local) */
function date25(ym) {
  const m = String(ym).match(/^(\d{4})-(\d{2})$/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, 25);
}

/** ได้คีย์เดือนก่อนหน้า (YYYY-MM) จากค่า select ("YYYY-MM-DD") */
function prevMonthKeyFromSelectValue(val) {
  if (!val) return "";
  const d = new Date(val); // val เป็น "YYYY-MM-DD"
  if (isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatThaiMonth(d) {
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const yearBE = d.getFullYear() + 543;
  return `25 ${months[d.getMonth()]} ${yearBE}`;
}

/** ช่วยอ่านผล API: รองรับทั้ง [] กับ {items:[…]} */
function asItems(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.items)) return json.items;
  return [];
}

/* ---------- โหลดรายการเดือนในดรอปดาวน์ ---------- */
async function loadMonthOptions() {
  const select = $("#monthSelect");
  select.innerHTML = `<option value="">-- เลือกเดือน --</option>`;

  // รวบรวมเดือนที่ถูกบันทึกไว้แล้ว (เก็บในรูป "YYYY-MM")
  const usedMonths = new Set();
  try {
    const [elecRes, waterRes] = await Promise.all([
      fetch(`${API_BASE}/electricity/getall`).then((r) => r.json()),
      fetch(`${API_BASE}/water/getall`).then((r) => r.json()),
    ]);
    asItems(elecRes).forEach((r) => usedMonths.add(monthKey(r.Emonth)));
    asItems(waterRes).forEach((r) => usedMonths.add(monthKey(r.Wmonth)));
  } catch (e) {
    console.warn("โหลดเดือนที่บันทึกแล้วไม่สำเร็จ", e);
  }

  // ช่วง 25 พ.ค. 2023 – 25 ธ.ค. 2029
  const start = new Date(2023, 4, 25);  // May=4
  const end = new Date(2029, 11, 25); // Dec=11

  for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const ym = `${y}-${m}`;
    if (usedMonths.has(ym)) continue; // ซ่อนเดือนที่บันทึกแล้ว

    // ❌ ไม่ใช้ toISOString() เพื่อเลี่ยง timezone shift
    const val = `${y}-${m}-25`; // "YYYY-MM-25"
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = formatThaiMonth(d);
    select.appendChild(opt);
  }
}

/* ---------- ดึงเลขเดือนก่อนหน้า ตามเดือนที่เลือก ---------- */
async function fetchElectricByMonth(ym) {
  if (!ym) return null;
  try {
    const res = await fetch(`${API_BASE}/electricity/getall?q=${encodeURIComponent(ym)}`);
    const json = await res.json();
    const items = asItems(json);
    return items[0] || null; // เดือนหนึ่งมี 1 รายการ
  } catch (e) {
    console.warn("fetchElectricByMonth error", e);
    return null;
  }
}

async function fetchWaterByMonth(ym) {
  if (!ym) return null;
  try {
    const res = await fetch(`${API_BASE}/water/getall?q=${encodeURIComponent(ym)}`);
    const json = await res.json();
    const items = asItems(json);
    return items[0] || null;
  } catch (e) {
    console.warn("fetchWaterByMonth error", e);
    return null;
  }
}

/** เมื่อเปลี่ยนเดือนใน select → เติม EprevMeter/WprevMeter เป็นค่าของเดือนก่อนหน้า */
async function onMonthChangeFillPrev() {
  const selectVal = $("#monthSelect").value; // "YYYY-MM-25"
  const prevYM = prevMonthKeyFromSelectValue(selectVal); // "YYYY-MM"
  if (!prevYM) {
    $("#EprevMeter").value = 0;
    $("#WprevMeter").value = 0;
    return;
  }

  const [prevE, prevW] = await Promise.all([
    fetchElectricByMonth(prevYM),
    fetchWaterByMonth(prevYM),
  ]);

  $("#EprevMeter").value = Number(prevE?.Emeter ?? 0);
  $("#WprevMeter").value = Number(prevW?.Wmeter ?? 0);
}

/* ---------- โหลดเลขเดือนก่อนล่าสุด (ค่าเริ่มต้นครั้งแรก) ---------- */
async function loadPrevMeters() {
  try {
    const elec = await fetch(`${API_BASE}/electricity/getall/latest`).then((r) => r.json());
    const water = await fetch(`${API_BASE}/water/getall/latest`).then((r) => r.json());
    $("#EprevMeter").value = elec?.Emeter ?? 0;
    $("#WprevMeter").value = water?.Wmeter ?? 0;
  } catch (e) {
    console.warn("โหลด prev meter fail", e);
  }
}

/* ---------- บันทึกข้อมูล (มีแค่อันเดียว ไม่ซ้ำ) ---------- */
$("#btnSave").addEventListener("click", async () => {
  const monthVal = $("#monthSelect").value;      // "YYYY-MM-25"
  const Emeter = Number($("#Emeter").value);
  const Wmeter = Number($("#Wmeter").value);
  const prevE = Number($("#EprevMeter").value || 0);
  const prevW = Number($("#WprevMeter").value || 0);
  const btn = $("#btnSave");

  // ตรวจสอบข้อมูล
  if (!monthVal || isNaN(Emeter) || isNaN(Wmeter)) {
    if (window.Swal) {
      await Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณาเลือกเดือน และใส่เลขมิเตอร์ไฟ/น้ำให้ครบถ้วน",
      });
    } else {
      alert("กรุณากรอกข้อมูลให้ครบ");
    }
    return;
  }

  // ตรวจว่าเลขใหม่ต้องไม่ต่ำกว่าเดือนก่อน
  if (Emeter < prevE || Wmeter < prevW) {
    const msg = `⚡ ไฟ: เดือนก่อน ${fmt(prevE)} → เดือนนี้ ${fmt(Emeter)}\n` +
      `💧 น้ำ: เดือนก่อน ${fmt(prevW)} → เดือนนี้ ${fmt(Wmeter)}`;
    if (window.Swal) {
      await Swal.fire({ icon: "warning", title: "เลขมิเตอร์ไม่ถูกต้อง", text: msg });
    } else {
      alert("เลขมิเตอร์เดือนนี้ต้องมากกว่าหรือเท่ากับเดือนก่อนหน้า\n\n" + msg);
    }
    return;
  }

  // คำนวณหน่วยและราคา
  const Eunits = Math.max(0, Emeter - prevE);
  const Wunits = Math.max(0, Wmeter - prevW);
  const Eprice = Eunits * ELEC_RATE;
  const Wprice = Wunits * WATER_RATE;
  const ym = monthVal.slice(0, 7); // "YYYY-MM"

  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/combined/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Emonth: ym, Emeter, Wmonth: ym, Wmeter }),
    });
    const data = await res.json();

    if (res.ok) {
      if (window.Swal) {
        await Swal.fire({
          icon: "success", title: "บันทึกสำเร็จ",
          html: `
            <div style="text-align:left;line-height:1.7">
              เดือน: <b>${ym}</b><br>
              ⚡ ไฟฟ้า: <b>${fmt(Eunits)}</b> หน่วย × ${fmt(ELEC_RATE)} = <b>${baht(Eprice)}</b><br>
              💧 น้ำ: <b>${fmt(Wunits)}</b> หน่วย × ${fmt(WATER_RATE)} = <b>${baht(Wprice)}</b><br>
              รวมทั้งสิ้น: <b>${baht(Eprice + Wprice)}</b>
            </div>
          `,
          timer: 2200, showConfirmButton: false,
        });
      } else {
        alert(`บันทึกมิเตอร์เดือน ${ym}\nไฟ: ${Eunits} หน่วย = ${Eprice} บาท\nน้ำ: ${Wunits} หน่วย = ${Wprice} บาท\nรวม: ${Eprice + Wprice} บาท`);
      }

      // ล้างและรีโหลด
      $("#Emeter").value = "";
      $("#Wmeter").value = "";
      $("#monthSelect").value = "";
      await loadMonthOptions();
      await onMonthChangeFillPrev();
    } else {
      const msg = data?.message || "ไม่สามารถบันทึกข้อมูลได้";
      if (window.Swal) await Swal.fire({ icon: "error", title: "บันทึกล้มเหลว", text: msg });
      else alert("บันทึกล้มเหลว: " + msg);
    }
  } catch (err) {
    if (window.Swal) await Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้" });
    else alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
  } finally {
    btn.disabled = false;
  }
});

/* ---------- init ---------- */
$("#monthSelect").addEventListener("change", onMonthChangeFillPrev);
loadMonthOptions().then(onMonthChangeFillPrev);
loadPrevMeters(); // ค่าเริ่มต้นกรณีผู้ใช้ยังไม่เลือกเดือน
