export function formatDateForElSalvador(value?: string | null) {
  if (!value) return "-";

  const [year, month, day] = value.slice(0, 10).split("-");

  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

export function addMonths(dateValue: string, months: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const originalDay = date.getUTCDate();

  date.setUTCMonth(date.getUTCMonth() + months);

  if (date.getUTCDate() !== originalDay) {
    date.setUTCDate(0);
  }

  return date.toISOString().slice(0, 10);
}
