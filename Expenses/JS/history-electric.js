const API_BASE = "https://biwbongshopbackend.onrender.com/expenses";

/* ===================== Helpers ===================== */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

function setStatus(msg, cls = "") {
    const el = $("#status");
    if (!el) return;
    el.textContent = msg || "";
    el.className = `sub status ${cls}`.trim();
}

// "YYYY-MM-DD" -> Date (local) | null
function createDateYMD(ymd) {
    if (!ymd || typeof ymd !== "string") return null;
    const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    const dt = new Date(y, mo - 1, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
}

// "YYYY-MM" -> Date (local) ของวันที่ 25
function createDateYM(ym) {
    if (!ym || typeof ym !== "string") return null;
    const m = ym.match(/^(\d{4})-(\d{2})$/);
    if (!m) return null;
    const y = +m[1], mo = +m[2];
    const dt = new Date(y, mo - 1, 25);
    return Number.isNaN(dt.getTime()) ? null : dt;
}

function fmtThaiDateFromDate(dt) {
    if (!(dt instanceof Date)) return "";
    return dt.toLocaleDateString("th-TH", { day: "2-digit", month: "long", year: "numeric" });
}

// รองรับ Date | "YYYY-MM-DD" | ISO string | timestamp
function fmtThaiDateLoose(input) {
    if (!input && input !== 0) return "";
    if (input instanceof Date) return fmtThaiDateFromDate(input);
    if (typeof input === "string") {
        const dYMD = createDateYMD(input);
        if (dYMD) return fmtThaiDateFromDate(dYMD);
        const t = Date.parse(input);
        if (!Number.isNaN(t)) return fmtThaiDateFromDate(new Date(t));
        return "";
    }
    if (typeof input === "number" && !Number.isNaN(input)) {
        return fmtThaiDateFromDate(new Date(input));
    }
    return "";
}

function parseMonthLikeToDate(s) {
    if (!s) return null;
    // "YYYY-MM-25" -> Date
    const mYMD = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (mYMD) {
        const y = +mYMD[1], mo = +mYMD[2], d = +mYMD[3];
        const dt = new Date(y, mo - 1, d);
        return Number.isNaN(dt.getTime()) ? null : dt;
    }
    // "YYYY-MM" -> Date (fix day = 25)
    const mYM = String(s).match(/^(\d{4})-(\d{1,2})$/);
    if (mYM) {
        const y = +mYM[1], mo = +mYM[2];
        const dt = new Date(y, mo - 1, 25);
        return Number.isNaN(dt.getTime()) ? null : dt;
    }
    return null;
}

function monthLikeToThai(s) {
    const dt = parseMonthLikeToDate(s);
    return dt ? fmtThaiDateFromDate(dt) : "";
}

function monthToThai(ym) {                 // "YYYY-MM" -> "25 <เดือน> พ.ศ. 25xx"
    const d = createDateYM(ym);
    return d ? fmtThaiDateFromDate(d) : "";
}

/* ===================== API ===================== */
async function fetchElectricAll() {
    const res = await fetch(`${API_BASE}/electricity/getall`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || "fetch error");
    return json?.items ?? json ?? [];
}

async function deleteElectric(Eid) {
    const res = await fetch(`${API_BASE}/electricity/getall/${encodeURIComponent(Eid)}`, {
        method: "DELETE"
    });
    const j = await res.json().catch(() => null);
    if (!res.ok) throw new Error(j?.message || "ลบไม่สำเร็จ");
}

async function updateElectric(Eid, payload) { // { Emeter?, EprevMeter?, Emonth? }
    const res = await fetch(`${API_BASE}/electricity/getall/${encodeURIComponent(Eid)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const j = await res.json().catch(() => null);
    if (!res.ok || (j && j.success === false)) throw new Error(j?.message || "อัปเดตไม่สำเร็จ");
    return j;
}

/* ===================== Table ===================== */
function renderTable(items) {
    const tbody = $("#table tbody");
    if (!tbody) { return; }

    tbody.innerHTML = "";

    if (!Array.isArray(items) || !items.length) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="9" style="text-align:center;color:#64748b;">ไม่มีข้อมูล</td>`;
        tbody.appendChild(tr);
        return;
    }

    // เรียงใหม่→เก่า ตาม Emonth
    items.sort((a, b) => {
        const ad = parseMonthLikeToDate(a.Emonth ?? a.month ?? "");
        const bd = parseMonthLikeToDate(b.Emonth ?? b.month ?? "");
        const at = ad ? ad.getTime() : 0;
        const bt = bd ? bd.getTime() : 0;
        return at - bt; // <-- เปลี่ยนตรงนี้
    });

    items.forEach(r => {
        const Eid = r.Eid ?? r.id ?? "";
        const EmonthRaw = r.Emonth ?? r.month ?? "";        // อาจเป็น "YYYY-MM" หรือ "YYYY-MM-25"
        const Emeter = Number(r.Emeter ?? r.meter ?? 0);
        const EprevMeter = Number(r.EprevMeter ?? r.prev ?? 0);
        const Eunits = Number(r.Eunits ?? Math.max(0, Emeter - EprevMeter));
        const Eprice = r.Eprice ?? "";
        const EdateRaw = r.Edate ?? r.createdAt ?? r.updatedAt ?? "";

        const displayMonth = monthLikeToThai(EmonthRaw) || "-";    // → "25 มิถุนายน 2566"
        const displayDate = fmtThaiDateLoose(EdateRaw) || displayMonth || "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${displayMonth}</td>
            <td>${Emeter}</td>
            <td>${EprevMeter}</td>
            <td>${Eunits}</td>
            <td>${Eprice}</td>
            <td>${displayDate}</td>
            <td class="text-center">
    <button
        type="button"
        data-edit="${Eid}"
        title="แก้ไข"
        aria-label="แก้ไข"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
    >
        <i class="fa-solid fa-pen-to-square"></i>
    </button>
</td>

<td class="text-center">
    <button
        type="button"
        data-del="${Eid}"
        title="ลบ"
        aria-label="ลบ"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white"
    >
        <i class="fa-solid fa-trash"></i>
    </button>
</td>
        `;
        tbody.appendChild(tr);
    });

    /* ====== แก้ไขด้วย SweetAlert2 ====== */
    $$('button[data-edit]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-edit');
            const row = items.find(x => (x.Eid ?? x.id) === id);

            const initPrev = Number(row?.EprevMeter ?? 0);
            const initCurr = Number(row?.Emeter ?? 0);
            const initMonth = (row?.Emonth ?? "").slice(0, 7); // "YYYY-MM"
            const initCreated = row?.createdAt
                ? new Date(row.createdAt).toISOString().slice(0, 10) // "YYYY-MM-DD"
                : "";

            const { value: formValues } = await Swal.fire({
                title: "แก้ไขข้อมูลไฟฟ้า",
                html: `
        <div style="text-align:left">
          <label style="display:block;margin:6px 0 2px">รอบเดือน (Emonth)</label>
          <input id="swal-month" type="text" class="swal2-input" style="width:75%;margin:0" value="${initMonth}">
        
          <label style="display:block;margin:6px 0 2px">Emeter</label>
          <input id="swal-curr" type="number" class="swal2-input" style="width:75%;margin:0" value="${initCurr}">
          
          <label style="display:block;margin:6px 0 2px">EprevMeter</label>
          <input id="swal-prev" type="number" class="swal2-input" style="width:75%;margin:0" value="${initPrev}">

          <label style="display:block;margin:6px 0 2px">วันที่บันทึก (createdAt)</label>
          <input id="swal-created" type="date" class="swal2-input" style="width:75%;margin:0" value="${initCreated}">

        </div>
      `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "บันทึก",
                cancelButtonText: "ยกเลิก",
                preConfirm: () => {
                    const monthVal = document.getElementById("swal-month").value;
                    const createdVal = document.getElementById("swal-created").value;
                    const curr = Number(document.getElementById("swal-curr").value || 0);
                    const prev = Number(document.getElementById("swal-prev").value || 0);

                    if (!monthVal) {
                        Swal.showValidationMessage("กรุณาเลือกเดือนรอบบิล");
                        return false;
                    }
                    if (Number.isNaN(prev) || Number.isNaN(curr)) {
                        Swal.showValidationMessage("กรุณากรอกตัวเลขให้ถูกต้อง");
                        return false;
                    }
                    if (curr < prev) {
                        Swal.showValidationMessage("เลขปัจจุบันต้องไม่ต่ำกว่าเดือนก่อน");
                        return false;
                    }

                    return { monthVal, createdVal, prev, curr };
                }
            });

            if (!formValues) return; // กดยกเลิก

            try {
                await updateElectric(id, {
                    Emeter: formValues.curr,
                    EprevMeter: formValues.prev,
                    Emonth: formValues.monthVal,          // ส่ง YYYY-MM → backend จะ normalize เป็น YYYY-MM-25
                    createdAt: formValues.createdVal || null // ส่งวันที่ใหม่ถ้าเลือก
                });

                await Swal.fire({
                    icon: "success",
                    title: "บันทึกสำเร็จ",
                    timer: 1200,
                    showConfirmButton: false
                });
                reload();
            } catch (e) {
                Swal.fire({
                    icon: "error",
                    title: "บันทึกล้มเหลว",
                    text: e.message || "เกิดข้อผิดพลาด"
                });
            }
        });
    });

    /* ====== ลบด้วย SweetAlert2 ====== */
    $$('button[data-del]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-del');
            const ok = await Swal.fire({
                title: 'ยืนยันการลบ?',
                text: 'รายการนี้จะถูกลบถาวร',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก'
            });
            if (!ok.isConfirmed) return;

            try {
                await deleteElectric(id);
                await Swal.fire({
                    icon: 'success',
                    title: 'ลบสำเร็จ',
                    timer: 1000,
                    showConfirmButton: false
                });
                reload();
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'ลบล้มเหลว',
                    text: e.message || 'เกิดข้อผิดพลาด'
                });
            }
        });
    });
}

/* ===================== Load ===================== */
async function reload() {
    try {
        setStatus("กำลังโหลดข้อมูล…");
        const items = await fetchElectricAll();
        renderTable(items);
        setStatus(`พบ ประวัตการใช้ไฟฟ้า แล้ว ${items.length} รายการ`);
    } catch (e) {
        console.error(e);
        setStatus("โหลดข้อมูลไม่สำเร็จ", "err");
        renderTable([]);
    }
}

// เริ่มต้น: โหลดเองอัตโนมัติ
reload();
