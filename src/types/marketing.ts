export type ActivityCategory =
  | 'Persiapan'
  | 'Konten'
  | 'Pemetaan Bengkel'
  | 'Kunjungan Bengkel'
  | 'Webinar'
  | 'Follow-up'
  | 'Evaluasi';

export type ActivityStatus =
  | 'Belum Dimulai'
  | 'Sedang Berjalan'
  | 'Selesai'
  | 'Ditunda';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // e.g., 'Selasa'
  title: string;
  category: ActivityCategory;
  activityDetail: string;
  targetOutput: string;
  status: ActivityStatus;
  checklist: ChecklistItem[];
  evaluationNotes?: string;
  pic?: string;
}

export interface WorkshopTarget {
  id: string;
  name: string;
  owner: string;
  phone: string;
  address: string;
  district: string;
  type: 'Mobil' | 'Motor' | 'Campuran' | 'Spesialis AC/Kaki-kaki';
  visitStatus: 'Belum Dikunjungi' | 'Terjadwal' | 'Sudah Dikunjungi' | 'Follow-up' | 'Tertarik Demo' | 'Onboarding';
  notes: string;
  visitDate?: string;
}

export interface WeeklyEvaluation {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // 'Jumat'
  title: string;
  focus: string;
  achievedResults: string;
  obstacles: string;
  improvementPlan: string;
  additionalNotes: string;
  status: 'Draft' | 'Final';
}

export interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  password: string;
}
