import { formatDateThai } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();
    loadBorrowHistory();
});

async function loadBorrowHistory() {
    try {
        const tbody = document.getElementById('borrowTableBody');

        if (!tbody) return;

        tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-5 py-12 text-center">
          <div class="flex flex-col items-center gap-3 text-gray-400">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <i class="fas fa-spinner fa-spin text-emerald-600"></i>
            </div>

            <span>
              กำลังโหลดข้อมูล...
            </span>
          </div>
        </td>
      </tr>
    `;

        const res = await fetch(
            `${backendURL}/borrows/getall`,
            {
                credentials: 'include'
            }
        );

        if (!res.ok) {
            throw new Error('โหลดข้อมูลล้มเหลว');
        }

        const data = await res.json();

        const list =
            Array.isArray(data?.borrows)
                ? data.borrows
                : Array.isArray(data?.items)
                    ? data.items
                    : [];

        list.sort((a, b) => {
            if (a.Returned !== b.Returned) {
                return (a.Returned ? 1 : 0) -
                    (b.Returned ? 1 : 0);
            }

            return (a.BorrowID || 0) -
                (b.BorrowID || 0);
        });

        tbody.innerHTML = '';

        if (!list.length) {
            tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-5 py-12 text-center">
            <div class="flex flex-col items-center gap-3 text-gray-400">

              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <i class="fas fa-clipboard-list text-xl"></i>
              </div>

              <span>
                ยังไม่มีประวัติการยืม
              </span>

            </div>
          </td>
        </tr>
      `;

            return;
        }

        list.forEach((e, index) => {

            const isReturned = !!e.Returned;

            const remaining =
                (e.Quantity || 0) -
                (e.ReturnedQuantity || 0);


            const tr = document.createElement('tr');

            tr.className =
                'transition-colors duration-150 hover:bg-emerald-50/60';


            const tdIndex =
                document.createElement('td');

            tdIndex.className =
                'border-b border-gray-100 px-4 py-4 text-center text-gray-400';

            tdIndex.textContent =
                String(index + 1);


            const tdName =
                document.createElement('td');

            tdName.className =
                'border-b border-gray-100 px-4 py-4 text-gray-700';

            tdName.textContent =
                e.name || '-';


            const tdBorrower =
                document.createElement('td');

            tdBorrower.className =
                'border-b border-gray-100 px-4 py-4 font-medium text-gray-700';

            tdBorrower.textContent =
                e.names || '-';


            const tdEquipment =
                document.createElement('td');

            tdEquipment.className =
                'border-b border-gray-100 px-4 py-4 font-medium text-gray-800';

            tdEquipment.textContent =
                e.EName || '-';


            const tdQuantity =
                document.createElement('td');

            tdQuantity.className =
                'border-b border-gray-100 px-4 py-4 text-center';


            const quantityBadge =
                document.createElement('span');

            quantityBadge.className =
                'inline-flex min-w-[45px] items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700';

            quantityBadge.textContent =
                String(e.Quantity || 0);

            tdQuantity.appendChild(quantityBadge);


            const tdDate =
                document.createElement('td');

            tdDate.className =
                'border-b border-gray-100 px-4 py-4 text-gray-600';

            tdDate.textContent =
                formatDateThai(e.Date);


            const tdReturnDate =
                document.createElement('td');

            tdReturnDate.className =
                'border-b border-gray-100 px-4 py-4 text-gray-600';

            tdReturnDate.textContent =
                e.ReturnDate
                    ? formatDateThai(e.ReturnDate)
                    : '-';


            const tdStatus =
                document.createElement('td');

            tdStatus.className =
                'border-b border-gray-100 px-4 py-4 text-center';


            if (isReturned) {

                const status =
                    document.createElement('span');

                status.className = `
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-emerald-100
          px-4
          py-2
          text-xs
          font-semibold
          text-emerald-700
        `;

                status.innerHTML = `
          <i class="fas fa-check-circle"></i>
          คืนแล้ว
        `;

                tdStatus.appendChild(status);

            } else {

                const button =
                    document.createElement('button');

                button.type = 'button';

                button.className = `
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-amber-500
          px-4
          py-2
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          duration-200
          hover:bg-amber-600
          hover:shadow-md
          active:scale-95
        `;

                button.innerHTML = `
          <i class="fas fa-undo"></i>
          คืนอุปกรณ์
        `;

                button.addEventListener(
                    'click',
                    () => {
                        returnEquipment(
                            e.BorrowID,
                            remaining
                        );
                    }
                );

                tdStatus.appendChild(button);
            }


            tr.appendChild(tdIndex);
            tr.appendChild(tdName);
            tr.appendChild(tdBorrower);
            tr.appendChild(tdEquipment);
            tr.appendChild(tdQuantity);
            tr.appendChild(tdDate);
            tr.appendChild(tdReturnDate);
            tr.appendChild(tdStatus);

            tbody.appendChild(tr);
        });

    } catch (err) {

        Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถโหลดประวัติการยืมได้',
            text: err.message,
        });
    }
}


async function returnEquipment(
    borrowID,
    maxQty
) {

    const { value: qty } =
        await Swal.fire({

            title: 'ระบุจำนวนที่ต้องการคืน',

            input: 'number',

            inputAttributes: {
                min: 1,
                max: maxQty,
                step: 1
            },

            inputValue: 1,

            showCancelButton: true,

            confirmButtonText: 'คืนอุปกรณ์',

            cancelButtonText: 'ยกเลิก',

            confirmButtonColor: '#059669',

            cancelButtonColor: '#6b7280',

            preConfirm: (value) => {

                const val =
                    parseInt(value);

                if (
                    !val ||
                    val < 1 ||
                    val > maxQty
                ) {

                    Swal.showValidationMessage(
                        `กรุณาระบุจำนวนระหว่าง 1 ถึง ${maxQty}`
                    );

                    return false;
                }

                return val;
            }
        });


    if (!qty) return;


    try {

        const res =
            await fetch(
                `${backendURL}/returns/getall/create`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    credentials: 'include',

                    body: JSON.stringify({
                        BorrowID: borrowID,
                        returnQuantity: qty
                    })
                }
            );


        if (!res.ok) {

            const err =
                await res.json();

            throw new Error(
                err.message ||
                'เกิดข้อผิดพลาด'
            );
        }


        await Swal.fire({
            icon: 'success',
            title: 'คืนอุปกรณ์สำเร็จ',
            timer: 1500,
            showConfirmButton: false
        });


        loadBorrowHistory();

    } catch (err) {

        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message
        });
    }
}