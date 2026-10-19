export const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatToIndonesianDate(dateStr: string, options?: { showDay?: boolean; showYear?: boolean }): string {
  try {
    const d = parseLocalDate(dateStr);
    const dayName = INDONESIAN_DAYS[d.getDay()];
    const day = d.getDate();
    const month = INDONESIAN_MONTHS_SHORT[d.getMonth()];
    const year = d.getFullYear();

    if (options?.showDay) {
      return `${dayName}, ${day} ${month} ${options?.showYear !== false ? year : ''}`.trim();
    }
    return `${day} ${month} ${options?.showYear !== false ? year : ''}`.trim();
  } catch {
    return dateStr;
  }
}

export function formatIndonesianFull(dateStr: string): string {
  try {
    const d = parseLocalDate(dateStr);
    const dayName = INDONESIAN_DAYS[d.getDay()];
    const day = d.getDate();
    const month = INDONESIAN_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function getDayNameIndonesian(dateStr: string): string {
  try {
    const d = parseLocalDate(dateStr);
    return INDONESIAN_DAYS[d.getDay()];
  } catch {
    return '';
  }
}

export function isWeekend(dateStr: string): boolean {
  try {
    const d = parseLocalDate(dateStr);
    const day = d.getDay();
    return day === 0 || day === 6; // 0 = Minggu, 6 = Sabtu
  } catch {
    return false;
  }
}

export function isFriday(dateStr: string): boolean {
  try {
    const d = parseLocalDate(dateStr);
    return d.getDay() === 5; // 5 = Jumat
  } catch {
    return false;
  }
}
