import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ActivityItem } from '../types/marketing';
import { formatToIndonesianDate, INDONESIAN_MONTHS, isWeekend, isFriday } from '../utils/dateUtils';
import { getCategoryBadgeClass, getStatusBadgeClass } from '../utils/styleHelpers';

interface CalendarViewProps {
  activities: ActivityItem[];
  onSelectActivity: (activity: ActivityItem) => void;
  onOpenAddModalWithDate?: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  activities,
  onSelectActivity,
  onOpenAddModalWithDate,
}) => {
  // Default to October 2026 (the start of the campaign period)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = Oktober, 10 = November
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-20');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const setCampaignMonth = (monthIndex: number) => {
    setCurrentYear(2026);
    setCurrentMonth(monthIndex);
  };

  // Generate days for currentMonth
  // Calendar headers: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu
  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // 0 = Senin, 6 = Minggu

  const calendarCells = [];
  // Previous month padding
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Activities for selected date
  const selectedDateActivities = activities.filter((a) => a.date === selectedDateStr);
  const isSelectedWeekend = isWeekend(selectedDateStr);
  const isSelectedFriday = isFriday(selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Month Navigation Header */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {INDONESIAN_MONTHS[currentMonth]} {currentYear}
            </h2>
            <p className="text-xs text-slate-500">
              Periode Aktif Kampanye: 20 Oktober – 18 November 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Shortcuts */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setCampaignMonth(9)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                currentMonth === 9 && currentYear === 2026
                  ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Oktober 2026
            </button>
            <button
              type="button"
              onClick={() => setCampaignMonth(10)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                currentMonth === 10 && currentYear === 2026
                  ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              November 2026
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-semibold text-slate-700">
          {weekDays.map((wd, i) => (
            <div
              key={wd}
              className={`py-2.5 ${i >= 5 ? 'text-rose-600/80 bg-rose-50/30' : ''}`}
            >
              {wd} {i >= 5 && <span className="text-[10px] font-normal block sm:inline">(Libur)</span>}
              {i === 4 && <span className="text-[10px] font-normal block sm:inline text-emerald-600">(Eval)</span>}
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {calendarCells.map((dayNum, idx) => {
            if (dayNum === null) {
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-[90px] sm:min-h-[110px] bg-slate-50/40 p-2"
                />
              );
            }

            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

            const colIndex = idx % 7;
            const isWeekendCell = colIndex === 5 || colIndex === 6;
            const isFridayCell = colIndex === 4;
            const isSelected = selectedDateStr === dateStr;

            // Activities on this day
            const dayActivities = activities.filter((a) => a.date === dateStr);

            // Is within campaign range? (2026-10-20 to 2026-11-18)
            const isCampaignRange = dateStr >= '2026-10-20' && dateStr <= '2026-11-18';

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-rose-500 ring-inset bg-rose-50/20 z-10'
                    : 'hover:bg-slate-50/70'
                } ${
                  isWeekendCell
                    ? 'bg-slate-50/70'
                    : isCampaignRange
                    ? 'bg-white'
                    : 'bg-white/60 text-slate-400'
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold font-mono ${
                      isSelected
                        ? 'bg-rose-600 text-white'
                        : isCampaignRange
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isWeekendCell ? (
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      Libur
                    </span>
                  ) : isFridayCell && isCampaignRange ? (
                    <span className="text-[10px] text-emerald-700 font-medium px-1.5 py-0.2 bg-emerald-50 rounded hidden sm:inline">
                      Evaluasi
                    </span>
                  ) : null}
                </div>

                {/* Activities inside Cell */}
                <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                  {dayActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectActivity(act);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[11px] truncate font-medium border cursor-pointer hover:opacity-80 transition-opacity ${getCategoryBadgeClass(
                        act.category
                      )}`}
                      title={`${act.title} (${act.status})`}
                    >
                      {act.title}
                    </div>
                  ))}

                  {isWeekendCell && dayActivities.length === 0 && (
                    <div className="text-[10px] text-slate-400 italic text-center pt-2 hidden sm:block">
                      Libur akhir pekan
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail Drawer / Panel */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900">
              Agenda {formatToIndonesianDate(selectedDateStr, { showDay: true })}
            </h3>
            <p className="text-xs text-slate-500">
              {isSelectedWeekend
                ? 'Hari Libur Akhir Pekan (Sabtu & Minggu bebas dari kegiatan pemasaran)'
                : isSelectedFriday
                ? 'Hari Jumat: Khusus pelaksanaan evaluasi mingguan marketing'
                : 'Hari Kerja Efektif: Target produksi konten, pemetaan, kunjungan, & promosi'}
            </p>
          </div>

          {!isSelectedWeekend && onOpenAddModalWithDate && (
            <button
              type="button"
              onClick={() => onOpenAddModalWithDate(selectedDateStr)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah di Tanggal Ini</span>
            </button>
          )}
        </div>

        {/* Selected Date Content */}
        {selectedDateActivities.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            {isSelectedWeekend ? (
              <div className="space-y-1">
                <span className="font-semibold text-slate-600 block">
                  Tidak ada agenda marketing di hari Sabtu/Minggu.
                </span>
                <span>Seluruh tim marketing istirahat dari agenda operasional.</span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="font-semibold text-slate-600 block">
                  Belum ada kegiatan terjadwal di tanggal ini.
                </span>
                <span>Klik tombol "Tambah di Tanggal Ini" jika ingin menambahkan agenda baru.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDateActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="p-4 border border-slate-200 rounded-xl hover:border-rose-400 hover:bg-rose-50/10 cursor-pointer transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                      act.category
                    )}`}
                  >
                    {act.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getStatusBadgeClass(
                      act.status
                    )}`}
                  >
                    {act.status}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-900">{act.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {act.activityDetail}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Target: <strong className="text-slate-800">{act.targetOutput}</strong></span>
                  <span className="text-rose-600 font-medium">Buka Detail →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
