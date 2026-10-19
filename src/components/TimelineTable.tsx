import React, { useState, useMemo } from 'react';
import {
  Filter,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { ActivityItem, ActivityCategory, ActivityStatus } from '../types/marketing';
import { formatToIndonesianDate } from '../utils/dateUtils';
import { getCategoryBadgeClass, getStatusBadgeClass } from '../utils/styleHelpers';

interface TimelineTableProps {
  activities: ActivityItem[];
  searchTerm: string;
  onSelectActivity: (activity: ActivityItem) => void;
  onEditActivity: (activity: ActivityItem) => void;
  onDeleteActivity: (activity: ActivityItem) => void;
  onUpdateStatus: (id: string, status: ActivityStatus) => void;
}

export const TimelineTable: React.FC<TimelineTableProps> = ({
  activities,
  searchTerm,
  onSelectActivity,
  onEditActivity,
  onDeleteActivity,
  onUpdateStatus,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: ActivityCategory[] = [
    'Persiapan',
    'Konten',
    'Pemetaan Bengkel',
    'Kunjungan Bengkel',
    'Webinar',
    'Follow-up',
    'Evaluasi',
  ];

  const statuses: ActivityStatus[] = [
    'Belum Dimulai',
    'Sedang Berjalan',
    'Selesai',
    'Ditunda',
  ];

  // Filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(query);
        const matchesDetail = act.activityDetail.toLowerCase().includes(query);
        const matchesTarget = act.targetOutput.toLowerCase().includes(query);
        const matchesCategory = act.category.toLowerCase().includes(query);
        const matchesPic = act.pic?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesDetail && !matchesTarget && !matchesCategory && !matchesPic) {
          return false;
        }
      }

      // Month filter
      if (selectedMonth !== 'all') {
        const actMonth = act.date.slice(0, 7); // '2026-10' or '2026-11'
        if (actMonth !== selectedMonth) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all' && act.status !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && act.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [activities, searchTerm, selectedMonth, selectedStatus, selectedCategory]);

  const handleResetFilters = () => {
    setSelectedMonth('all');
    setSelectedStatus('all');
    setSelectedCategory('all');
  };

  const hasActiveFilters =
    selectedMonth !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || Boolean(searchTerm);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-rose-600" />
            <span>Filter Timeline</span>
            <span className="text-slate-400 font-normal">
              ({filteredActivities.length} dari {activities.length} kegiatan)
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Bulan */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Bulan Pelaksanaan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-rose-500 focus:bg-white"
            >
              <option value="all">Semua Bulan (Okt &amp; Nov)</option>
              <option value="2026-10">Oktober 2026</option>
              <option value="2026-11">November 2026</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Status Kegiatan
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-rose-500 focus:bg-white"
            >
              <option value="all">Semua Status</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Kategori Kegiatan
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-rose-500 focus:bg-white"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3 px-3.5 w-12 text-center">No.</th>
                <th className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">Tanggal &amp; Hari</th>
                <th className="py-3 px-3.5 min-w-[200px]">Kegiatan</th>
                <th className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">Kategori</th>
                <th className="py-3 px-3.5 min-w-[260px]">Detail Aktivitas</th>
                <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">Target / Output</th>
                <th className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">Status</th>
                <th className="py-3 px-3.5 text-center whitespace-nowrap w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-medium text-slate-700">Tidak ada kegiatan yang cocok</p>
                      <p className="text-xs">Coba sesuaikan kata kunci pencarian atau reset filter di atas.</p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold border border-rose-200 rounded-lg hover:bg-rose-50"
                      >
                        Reset Semua Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act, index) => (
                  <tr
                    key={act.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* No. */}
                    <td className="py-3.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">
                      {index + 1}
                    </td>

                    {/* Tanggal & Hari */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {formatToIndonesianDate(act.date, { showDay: false })}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{act.dayName}</div>
                    </td>

                    {/* Kegiatan */}
                    <td className="py-3.5 px-3.5">
                      <button
                        type="button"
                        onClick={() => onSelectActivity(act)}
                        className="text-left font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                      >
                        {act.title}
                      </button>
                      {act.pic && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          PIC: {act.pic}
                        </div>
                      )}
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium border ${getCategoryBadgeClass(
                          act.category
                        )}`}
                      >
                        {act.category}
                      </span>
                    </td>

                    {/* Detail Aktivitas */}
                    <td className="py-3.5 px-3.5 text-slate-600 leading-relaxed text-xs">
                      {act.activityDetail}
                      {act.checklist && act.checklist.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {act.checklist.filter((c) => c.completed).length} dari {act.checklist.length} checklist tuntas
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Target / Output */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-xs inline-block">
                        {act.targetOutput}
                      </div>
                    </td>

                    {/* Status with Inline Dropdown */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={act.status}
                          onChange={(e) => onUpdateStatus(act.id, e.target.value as ActivityStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border appearance-none pr-6 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-rose-500 ${getStatusBadgeClass(
                            act.status
                          )}`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none opacity-60" />
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectActivity(act)}
                          title="Lihat Detail"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditActivity(act)}
                          title="Edit Kegiatan"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteActivity(act)}
                          title="Hapus Kegiatan"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-500 text-xs">
            Tidak ada kegiatan yang sesuai filter.
          </div>
        ) : (
          filteredActivities.map((act, index) => (
            <div
              key={act.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {formatToIndonesianDate(act.date, { showDay: true })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(
                    act.category
                  )}`}
                >
                  {act.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {act.activityDetail}
              </p>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Output:</span>
                <span className="font-semibold text-slate-800">{act.targetOutput}</span>
              </div>

              {/* Status and Actions in Mobile */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                <select
                  value={act.status}
                  onChange={(e) => onUpdateStatus(act.id, e.target.value as ActivityStatus)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusBadgeClass(
                    act.status
                  )}`}
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSelectActivity(act)}
                    className="p-1.5 text-xs text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200"
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditActivity(act)}
                    className="p-1.5 text-xs text-rose-600 bg-rose-50 rounded-md hover:bg-rose-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteActivity(act)}
                    className="p-1.5 text-xs text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
