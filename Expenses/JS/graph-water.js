const API_BASE = "https://biwbongshopbackend.onrender.com/expenses";

/* ===== Helpers ===== */
const $ = (q, el=document) => el.querySelector(q);
function setStatus(msg, cls=""){ const el=$("#status"); if(el){ el.textContent=msg; el.className=`sub ${cls}`; } }

function createDateYMD(ymd){
  if(!ymd) return null;
  const m = String(ymd).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return null;
  const dt = new Date(+m[1], +m[2]-1, +m[3]);
  return Number.isNaN(dt.getTime()) ? null : dt;
}
function parseMonthLikeToDate(s){
  if(!s) return null;
  const mYMD = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(mYMD){ const dt=new Date(+mYMD[1], +mYMD[2]-1, +mYMD[3]); return Number.isNaN(dt.getTime())?null:dt; }
  const mYM = String(s).match(/^(\d{4})-(\d{1,2})$/);
  if(mYM){ const dt=new Date(+mYM[1], +mYM[2]-1, 25); return Number.isNaN(dt.getTime())?null:dt; }
  return null;
}
function fmtThaiDateFromDate(dt){
  return dt?.toLocaleDateString("th-TH",{day:"2-digit",month:"long",year:"numeric"}) || "";
}
function monthLikeToThai(s){ return fmtThaiDateFromDate(parseMonthLikeToDate(s)); }

/* ===== Fetch & Draw ===== */
async function fetchWaterAll(){
  const res = await fetch(`${API_BASE}/water/getall`);
  const j = await res.json().catch(()=> ({}));
  if(!res.ok) throw new Error(j?.message || "fetch error");
  return j?.items ?? j ?? [];
}

let chart;
async function draw(){
  try{
    setStatus("กำลังโหลดข้อมูล…");
    const items = await fetchWaterAll();

    // sort เก่า→ใหม่
    items.sort((a,b)=>{
      const ad=parseMonthLikeToDate(a.Wmonth ?? a.month ?? "");
      const bd=parseMonthLikeToDate(b.Wmonth ?? b.month ?? "");
      return (ad?ad.getTime():0) - (bd?bd.getTime():0);
    });

    const labels = items.map(r => monthLikeToThai(r.Wmonth ?? r.month ?? "") || "-");
    const data    = items.map(r => Number(r.Wunits ?? (r.Wmeter - r.WprevMeter) ?? 0));

    const ctx = document.getElementById("chartWater").getContext("2d");
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: "หน่วยน้ำ (m³)",
          data,
          tension: 0.3,
          borderColor: "#1e90ff",  // น้ำเงิน
          pointRadius: 3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { title: { display: true, text: "รอบเดือน" } },
          y: { title: { display: true, text: "หน่วย (m³)" }, beginAtZero: true }
        }
      }
    });

    setStatus(`แสดง แนวโน้มการใช้น้ำ แล้ว  ${items.length} รายการ`);
  }catch(e){
    console.error(e);
    setStatus("โหลดข้อมูลไม่สำเร็จ", "err");
  }
}

draw();
setInterval(draw, 30000);
