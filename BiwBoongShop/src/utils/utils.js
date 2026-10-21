export function formatDateThai(dateInput) {
  if (!dateInput) return '-';

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) return '-';

  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];

  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 543}`;
}