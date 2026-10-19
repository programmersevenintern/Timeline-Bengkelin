import React from 'react';
import {
  CalendarCheck,
  Video,
  Store,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ActivityItem, WorkshopTarget, WeeklyEvaluation } from '../types/marketing';
import { formatToIndonesianDate } from '../utils/dateUtils';
import { getCategoryBadgeClass, getStatusBadgeClass } from '../utils/styleHelpers';
import { NavTab } from './Sidebar';

interface DashboardOverviewProps {
  activities: ActivityItem[];
  workshops: WorkshopTarget[];
  evaluations: WeeklyEvaluation[];
  onSelectActivity: (activity: ActivityItem) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activities,
  workshops,
  evaluations,
  onSelectActivity,
  onNavigateTab,
}) => {
  // Statistics calculation
  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.status === 'Selesai').length;
  const inProgressActivities = activities.filter((a) => a.status === 'Sedang Berjalan').length;
  const notStartedActivities = activities.filter((a) => a.status === 'Belum Dimulai').length;

  // Video calculations
  // Target: maksimal 66 video (22 hari kerja x 3 video/hari pada Senin-Kamis)
  // Let's count published/in-progress videos from content items
  const contentActivities = activities.filter((a) => a.category === 'Konten');
  const estimatedVideosDone = activities
    .filter((a) => a.category === 'Konten' && a.status === 'Selesai')
    .reduce((acc, curr) => {
      const match = curr.targetOutput.match(/(\d+)\s*video/i);
      return acc + (match ? parseInt(match[1], 10) : 3);
    }, 0);
  const estimatedVideosInProgress = activities
    .filter((a) => a.category === 'Konten' && a.status === 'Sedang Berjalan')
    .reduce((acc, curr) => {
      const match = curr.targetOutput.match(/(\d+)\s*video/i);
      return acc + (match ? parseInt(match[1], 10) : 3);
    }, 0);

  // Workshop metrics
  const mappedWorkshopsCount = workshops.length; // target 20-30
  const visitedWorkshopsCount = workshops.filter(
    (w) => w.visitStatus === 'Sudah Dikunjungi' || w.visitStatus === 'Tertarik Demo' || w.visitStatus === 'Onboarding'
  ).length; // target 10-15
  const scheduledWorkshopsCount = workshops.filter((w) => w.visitStatus === 'Terjadwal').length;

  // Webinar metrics
  const webinarActivities = activities.filter((a) => a.category === 'Webinar');
  const webinarDate = '9 November 2026';

  // Overall completion percentage
  const overallPercent = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  // Upcoming activities: prioritize 'Sedang Berjalan' and 'Belum Dimulai'
  const upcomingActivities = activities
    .filter((a) => a.status === 'Sedang Berjalan' || a.status === 'Belum Dimulai')
    .slice(0, 4);

  // Categories distribution
  const categoriesList = [
    { name: 'Persiapan', count: activities.filter((a) => a.category === 'Persiapan').length },
    { name: 'Konten', count: activities.filter((a) => a.category === 'Konten').length },
    { name: 'Pemetaan Bengkel', count: activities.filter((a) => a.category === 'Pemetaan Bengkel').length },
    { name: 'Kunjungan Bengkel', count: activities.filter((a) => a.category === 'Kunjungan Bengkel').length },
    { name: 'Webinar', count: activities.filter((a) => a.category === 'Webinar').length },
    { name: 'Follow-up', count: activities.filter((a) => a.category === 'Follow-up').length },
    { name: 'Evaluasi', count: activities.filter((a) => a.category === 'Evaluasi').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Goal Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 rounded-2xl text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-rose-500/30 text-rose-300 rounded-md">
                Strategi 1 Bulan
              </span>
              <span className="text-xs text-slate-300 font-mono tabular-nums">
                20 Okt – 18 Nov 2026
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Akselerasi Akuisisi Pengguna Bengkelin
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Fokus pada produksi konten video harian edukasi manajemen bengkel, pemetaan &amp; kunjungan lapangan langsung, serta 1 sesi webinar demonstrasi website.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-right">
              <div className="text-xs text-slate-300">Total Progres</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {overallPercent}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-rose-500/40 border-t-rose-400 flex items-center justify-center font-bold text-xs text-rose-300">
              {completedActivities}/{totalActivities}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Kegiatan Terjadwal */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Kegiatan
            </span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              {totalActivities}
            </span>
            <span className="text-xs font-medium text-slate-500">agenda</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {completedActivities} Selesai
            </span>
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {inProgressActivities} Berjalan
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {notStartedActivities} Belum
            </span>
          </div>
        </div>

        {/* Card 2: Target Produksi Video */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Produksi Video
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              Maks. 66
            </span>
            <span className="text-xs font-medium text-slate-500">video</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Target 3 video/hari (Sen–Kam)</span>
              <span className="font-mono font-semibold text-blue-700">
                {estimatedVideosDone + estimatedVideosInProgress} aktif
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.round(((estimatedVideosDone + estimatedVideosInProgress) / 66) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Target Bengkel yang Dikunjungi */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Target Kunjungan
            </span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              {visitedWorkshopsCount}
              <span className="text-base text-slate-400 font-normal"> / 10–15</span>
            </span>
            <span className="text-xs font-medium text-slate-500">dikunjungi</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Pemetaan: <strong className="text-slate-800 font-mono">{mappedWorkshopsCount}</strong>/30</span>
            <span className="text-rose-600 font-medium">
              +{scheduledWorkshopsCount} Terjadwal
            </span>
          </div>
        </div>

        {/* Card 4: Target Webinar */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Target Webinar
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              1
            </span>
            <span className="text-xs font-medium text-slate-500">acara utama</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium text-purple-700">{webinarDate}</span>
            <span className="text-slate-500">Target &gt;50 Peserta</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Upcoming Agendas & Strategic Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming Activities (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Agenda Mendatang
              </h3>
              <p className="text-xs text-slate-500">
                Kegiatan aktif dan terjadwal dalam waktu dekat
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('timeline')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <span>Lihat Semua ({totalActivities})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingActivities.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                Seluruh kegiatan telah selesai dilaksanakan!
              </div>
            ) : (
              upcomingActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act)}
                  className="p-3.5 border border-slate-200 rounded-xl hover:border-rose-300 hover:bg-rose-50/20 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-500 tabular-nums">
                        {formatToIndonesianDate(act.date, { showDay: true })}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          act.category
                        )}`}
                      >
                        {act.category}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getStatusBadgeClass(
                          act.status
                        )}`}
                      >
                        {act.status}
                      </span>
                    </div>
                    <div className="font-medium text-sm text-slate-900">
                      {act.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {act.activityDetail}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-[11px] text-slate-400">Target Output</div>
                    <div className="text-xs font-semibold text-slate-700 font-mono">
                      {act.targetOutput}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Operational Rules & Category Distribution (1 col) */}
        <div className="space-y-4">
          {/* Rules Card */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Aturan Operasional</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>
                  <strong>Senin – Kamis:</strong> Produksi konten harian (target 3 video/hari) &amp; kunjungan lapangan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>
                  <strong>Jumat:</strong> Khusus evaluasi mingguan. Tidak ada agenda konten, promosi, atau kunjungan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <span>
                  <strong>Sabtu &amp; Minggu:</strong> Hari libur operasional marketing, tidak ada kegiatan terjadwal.
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Category Summary */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Distribusi Kategori ({totalActivities})
            </h3>
            <div className="space-y-2">
              {categoriesList.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{cat.name}</span>
                  <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
