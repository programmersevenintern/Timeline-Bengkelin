import { ActivityCategory, ActivityStatus } from '../types/marketing';

export function getStatusBadgeClass(status: ActivityStatus): string {
  switch (status) {
    case 'Selesai':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Sedang Berjalan':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Belum Dimulai':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Ditunda':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

export function getStatusDotClass(status: ActivityStatus): string {
  switch (status) {
    case 'Selesai':
      return 'bg-emerald-500';
    case 'Sedang Berjalan':
      return 'bg-amber-500';
    case 'Belum Dimulai':
      return 'bg-slate-400';
    case 'Ditunda':
      return 'bg-orange-500';
    default:
      return 'bg-slate-400';
  }
}

export function getCategoryBadgeClass(category: ActivityCategory): string {
  switch (category) {
    case 'Persiapan':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Konten':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Pemetaan Bengkel':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Kunjungan Bengkel':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Webinar':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Follow-up':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'Evaluasi':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
