let currentUser = null;
let loadAbort = null;

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await checkLogin();

    if (!currentUser) return;

    await loadEquipments();
});

function getDisplayName(user) {
    return (
        user?.name ??
        user?.Name ??
        user?.username ??
        user?.Username ??
        ''
    );
}

async function loadEquipments() {
    if (loadAbort) {
        loadAbort.abort();
    }

    loadAbort = new AbortController();

    const tbody = document.getElementById('equipmentBody');

    if (!tbody) return;

    tbody.innerHTML = `
    <tr>
      <td colspan="5" class="px-5 py-12 text-center">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <i class="fas fa-spinner fa-spin text-emerald-600"></i>
          </div>
          <span>กำลังโหลดข้อมูล...</span>
        </div>
      </td>
    </tr>
  `;

    try {
        const res = await fetch(`${backendURL}/equipments/getall`, {
            credentials: 'include',
            signal: loadAbort.signal,
        });

        if (res.status === 401) {
            await checkLogin();
            return;
        }

        if (!res.ok) {
            throw new Error('โหลดข้อมูลล้มเหลว');
        }

        const json = await res.json();

        const equipments = Array.isArray(json)
            ? json
            : (json.items || []);

        equipments.sort((a, b) => {
            const aAvailable = Number(a.Available ?? 0);
            const bAvailable = Number(b.Available ?? 0);

            if (aAvailable > 0 && bAvailable === 0) return -1;
            if (aAvailable === 0 && bAvailable > 0) return 1;

            return String(a.EName || '').localeCompare(
                String(b.EName || ''),
                'th',
                {
                    sensitivity: 'base',
                }
            );
        });

        tbody.innerHTML = '';

        if (!equipments.length) {
            tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-5 py-12 text-center">
            <div class="flex flex-col items-center gap-3 text-gray-400">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <i class="fas fa-box-open text-xl"></i>
              </div>
              <span>ไม่มีข้อมูลอุปกรณ์</span>
            </div>
          </td>
        </tr>
      `;

            return;
        }

        equipments.forEach((e, index) => {
            const available = Number(e.Available ?? 0);

            const tr = document.createElement('tr');

            tr.className =
                'transition-colors duration-150 hover:bg-emerald-50/60';

            const tdIdx = document.createElement('td');

            tdIdx.className =
                'border-b border-gray-100 px-5 py-3 text-center text-gray-400';

            tdIdx.textContent = String(index + 1);


            const tdName = document.createElement('td');

            tdName.className =
                'border-b border-gray-100 px-5 py-3 font-medium text-gray-700';

            tdName.textContent = String(e.EName ?? '-');


            const tdTotal = document.createElement('td');

            tdTotal.className =
                'border-b border-gray-100 px-5 py-3 text-center text-gray-600';

            tdTotal.textContent = String(e.Total ?? 0);


            const tdAvail = document.createElement('td');

            tdAvail.className =
                'border-b border-gray-100 px-5 py-3 text-center';


            const badge = document.createElement('span');

            badge.className = available > 0
                ? 'inline-flex min-w-[48px] items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700'
                : 'inline-flex min-w-[48px] items-center justify-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600';

            badge.textContent = String(available);

            tdAvail.appendChild(badge);


            const tdAct = document.createElement('td');

            tdAct.className =
                'border-b border-gray-100 px-5 py-3 text-center';


            if (available > 0) {

                const btn = document.createElement('button');

                btn.type = 'button';

                btn.className = `
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-emerald-600
          px-5
          py-2
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          duration-200
          hover:bg-emerald-700
          hover:shadow-md
          active:scale-95
        `;

                btn.innerHTML = `
          <i class="fas fa-hand-paper"></i>
          <span>ยืม</span>
        `;

                btn.dataset.eid = String(e.EID ?? '');
                btn.dataset.available = String(e.Available ?? 0);
                btn.dataset.ename = String(e.EName ?? '');

                tdAct.appendChild(btn);

            } else {

                const span = document.createElement('span');

                span.className = `
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-gray-100
          px-4
          py-2
          text-xs
          font-medium
          text-gray-400
        `;

                span.innerHTML = `
          <i class="fas fa-ban"></i>
          หมดแล้ว
        `;

                tdAct.appendChild(span);
            }


            tr.appendChild(tdIdx);
            tr.appendChild(tdName);
            tr.appendChild(tdTotal);
            tr.appendChild(tdAvail);
            tr.appendChild(tdAct);

            tbody.appendChild(tr);
        });

    } catch (err) {

        if (err.name === 'AbortError') {
            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'โหลดข้อมูลอุปกรณ์ล้มเหลว',
            text: err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
        });

    } finally {
        loadAbort = null;
    }
}


document
    .getElementById('equipmentBody')
    ?.addEventListener('click', async (e) => {

        const btn = e.target.closest('button[data-eid]');

        if (!btn) return;

        const EID = Number(btn.dataset.eid || 0);

        const available = Number(
            btn.dataset.available || 0
        );

        const EName =
            btn.dataset.ename || '';

        if (!EID || available <= 0) {
            return;
        }

        await borrowEquipment(
            EID,
            available,
            EName
        );
    });


async function borrowEquipment(
    EID,
    available,
    EName
) {

    const defaultName =
        getDisplayName(currentUser) ||
        localStorage.getItem('userName') ||
        '';


    const { value: formValues } =
        await Swal.fire({

            title: 'กรอกข้อมูลการยืม',

            html: `
        <div class="text-left">

          <label class="mb-1 block text-sm font-medium text-gray-600">
            ชื่อผู้ยืม
          </label>

          <input
            id="swal-input-name"
            class="swal2-input !mx-0 !w-full"
            placeholder="ชื่อผู้ยืม"
            value="${defaultName}"
          >

          <label class="mb-1 mt-3 block text-sm font-medium text-gray-600">
            จำนวนที่ต้องการยืม
          </label>

          <input
            id="swal-input-qty"
            type="number"
            class="swal2-input !mx-0 !w-full"
            placeholder="จำนวน"
            min="1"
            max="${available}"
            value="1"
          >

          <p class="mt-2 text-xs text-gray-400">
            คงเหลือ ${available} ชิ้น
          </p>

        </div>
      `,

            focusConfirm: false,

            showCancelButton: true,

            confirmButtonText: 'ยืนยันการยืม',

            cancelButtonText: 'ยกเลิก',

            confirmButtonColor: '#059669',

            cancelButtonColor: '#6b7280',

            preConfirm: () => {

                const name =
                    document
                        .getElementById('swal-input-name')
                        .value
                        .trim();

                const qty =
                    Number(
                        document
                            .getElementById('swal-input-qty')
                            .value
                    );

                if (!name) {

                    Swal.showValidationMessage(
                        'กรุณากรอกชื่อผู้ยืม'
                    );

                    return false;
                }

                if (
                    !qty ||
                    qty < 1 ||
                    qty > available
                ) {

                    Swal.showValidationMessage(
                        `กรุณาระบุจำนวนระหว่าง 1 ถึง ${available}`
                    );

                    return false;
                }

                return {
                    name,
                    qty,
                };
            },
        });


    if (!formValues) {
        return;
    }


    try {

        let res = await fetch(
            `${backendURL}/borrows/create`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',
                },

                credentials: 'include',

                body: JSON.stringify({
                    EquipmentID: EID,
                    EName: EName,
                    Quantity: formValues.qty,
                    names: formValues.name,
                }),
            }
        );


        if (res.status === 404) {

            res = await fetch(
                `${backendURL}/borrows/getall/create`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    credentials: 'include',

                    body: JSON.stringify({
                        EquipmentID: EID,
                        EName: EName,
                        Quantity: formValues.qty,
                        names: formValues.name,
                    }),
                }
            );
        }


        if (!res.ok) {

            const err =
                await safeJson(res);

            throw new Error(
                err.message ||
                'ยืมไม่สำเร็จ'
            );
        }


        await Swal.fire({
            icon: 'success',
            title: 'ยืมอุปกรณ์สำเร็จ',
            text: `${EName} จำนวน ${formValues.qty} ชิ้น`,
            timer: 1500,
            showConfirmButton: false,
        });


        await loadEquipments();

    } catch (err) {

        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text:
                err.message ||
                'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
        });
    }
}


async function safeJson(res) {
    try {
        return await res.json();
    } catch (_) {
        return {};
    }
}