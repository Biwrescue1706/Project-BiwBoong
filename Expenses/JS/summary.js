const API_BASE = "https://biwbongshopbackend.onrender.com/expenses";

const $ = (q, el = document) => el.querySelector(q);
function setStatus(msg, cls = "") {
  const el = $("#status");
  if (el) {
    el.textContent = msg;
    el.className = `sub ${cls}`;
  }
}

// ===== Utils =====
function parseMonthLikeToDate(s) {
  if (!s) return null;
  const mYMD = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (mYMD) return new Date(+mYMD[1], +mYMD[2] - 1, +mYMD[3]);
  const mYM = String(s).match(/^(\d{4})-(\d{2})$/);
  if (mYM) return new Date(+mYM[1], +mYM[2] - 1, 25);
  return null;
}

function fmtThaiDateFromDate(dt) {
  return (
    dt?.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) || ""
  );
}

function monthLikeToThai(s) {
  return fmtThaiDateFromDate(parseMonthLikeToDate(s));
}

// ===== API =====
async function fetchElectric() {
  const r = await fetch(`${API_BASE}/electricity/getall`);
  return r.ok ? await r.json() : [];
}
async function fetchWater() {
  const r = await fetch(`${API_BASE}/water/getall`);
  return r.ok ? await r.json() : [];
}

// ===== MAIN =====
async function reload() {
  try {
    setStatus("กำลังโหลดข้อมูล…");

    const [elec, water] = await Promise.all([fetchElectric(), fetchWater()]);

    // ทำ map แยกไฟกับน้ำ
    const mapElec = {};
    elec.forEach(r => {
      mapElec[r.Emonth] = {
        units: r.Eunits ?? (r.Emeter - r.EprevMeter),
        price: r.Eprice
      };
    });

    const mapWater = {};
    water.forEach(r => {
      mapWater[r.Wmonth] = {
        units: r.Wunits ?? (r.Wmeter - r.WprevMeter),
        price: r.Wprice
      };
    });

    // รวมเดือนทั้งหมด
    const months = Array.from(new Set([...Object.keys(mapElec), ...Object.keys(mapWater)]));

    // เรียงเก่า -> ใหม่
    months.sort((a, b) => {
      const ad = parseMonthLikeToDate(a);
      const bd = parseMonthLikeToDate(b);
      return (ad ? ad.getTime() : 0) - (bd ? bd.getTime() : 0);
    });

    // render
    const tbody = $("#table tbody");
    tbody.innerHTML = "";

    months.forEach(m => {
      const e = mapElec[m] || {};
      const w = mapWater[m] || {};
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${monthLikeToThai(m)}</td>
        <td>${e.units ?? "--"}</td>
        <td>${e.price ?? "--"}</td>
        <td>${w.units ?? "--"}</td>
        <td>${w.price ?? "--"}</td>
      `;
      tbody.appendChild(tr);
    });

    setStatus(`พบ รายการค่าน้ำ - ค่าไฟฟ้า แล้ว ${months.length} รายการ `) ;
  } catch (e) {
    console.error(e);
    setStatus("โหลดข้อมูลไม่สำเร็จ", "err");
  }
}

reload();
