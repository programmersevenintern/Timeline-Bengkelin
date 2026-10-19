import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { ActivityItem, ActivityCategory, ActivityStatus, ChecklistItem } from '../types/marketing';
import { formatIndonesianFull, getDayNameIndonesian, isWeekend, isFriday } from '../utils/dateUtils';
import { getCategoryBadgeClass, getStatusBadgeClass } from '../utils/styleHelpers';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItem | null;
  mode: 'view' | 'add' | 'edit';
  onSave: (activity: ActivityItem) => void;
  onDelete?: (activity: ActivityItem) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  mode: initialMode,
  onSave,
  onDelete,
}) => {
  const [currentMode, setCurrentMode] = useState<'view' | 'add' | 'edit'>(initialMode);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-20');
  const [category, setCategory] = useState<ActivityCategory>('Persiapan');
  const [activityDetail, setActivityDetail] = useState('');
  const [targetOutput, setTargetOutput] = useState('');
  const [status, setStatus] = useState<ActivityStatus>('Belum Dimulai');
  const [pic, setPic] = useState('');
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    setCurrentMode(initialMode);
    setErrorMessage('');
    if (activity && (initialMode === 'view' || initialMode === 'edit')) {
      setTitle(activity.title);
      setDate(activity.date);
      setCategory(activity.category);
      setActivityDetail(activity.activityDetail);
      setTargetOutput(activity.targetOutput);
      setStatus(activity.status);
      setPic(activity.pic || '');
      setEvaluationNotes(activity.evaluationNotes || '');
      setChecklist(activity.checklist || []);
    } else {
      // Add mode default
      setTitle('');
      setDate('2026-10-20');
      setCategory('Persiapan');
      setActivityDetail('');
      setTargetOutput('');
      setStatus('Belum Dimulai');
      setPic('');
      setEvaluationNotes('');
      setChecklist([]);
    }
  }, [activity, initialMode, isOpen]);

  if (!isOpen) return null;

  // Checklist handlers
  const handleToggleChecklist = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);

    // If in view mode and activity exists, automatically save update
    if (currentMode === 'view' && activity) {
      onSave({
        ...activity,
        checklist: updated,
      });
    }
  };

  const handleAddChecklist = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false,
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewChecklistText('');

    if (currentMode === 'view' && activity) {
      onSave({
        ...activity,
        checklist: updated,
      });
    }
  };

  const handleDeleteChecklistItem = (id: string) => {
    const updated = checklist.filter((item) => item.id !== id);
    setChecklist(updated);
    if (currentMode === 'view' && activity) {
      onSave({
        ...activity,
        checklist: updated,
      });
    }
  };

  // Status quick update in view mode
  const handleQuickStatusChange = (newStatus: ActivityStatus) => {
    setStatus(newStatus);
    if (activity) {
      onSave({
        ...activity,
        status: newStatus,
      });
    }
  };

  // Validation & Save form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Judul kegiatan tidak boleh kosong.');
      return;
    }
    if (!activityDetail.trim()) {
      setErrorMessage('Detail aktivitas wajib diisi.');
      return;
    }
    if (!targetOutput.trim()) {
      setErrorMessage('Target/output kegiatan wajib diisi.');
      return;
    }

    // Rule: Weekend cannot have activities
    if (isWeekend(date)) {
      setErrorMessage('Hari Sabtu dan Minggu merupakan hari libur. Tidak boleh menjadwalkan kegiatan.');
      return;
    }

    // Rule: Friday is ONLY for Evaluasi
    if (isFriday(date) && category !== 'Evaluasi') {
      setErrorMessage(
        'Hari Jumat dikhususkan untuk Evaluasi Mingguan. Jangan menambahkan agenda konten, promosi, atau kunjungan pada hari Jumat. Silakan ubah kategori menjadi Evaluasi atau pilih tanggal lain.'
      );
      return;
    }

    const dayName = getDayNameIndonesian(date);

    const savedItem: ActivityItem = {
      id: activity?.id || `act-${Date.now()}`,
      date,
      dayName,
      title: title.trim(),
      category,
      activityDetail: activityDetail.trim(),
      targetOutput: targetOutput.trim(),
      status,
      pic: pic.trim(),
      evaluationNotes: evaluationNotes.trim(),
      checklist,
    };

    onSave(savedItem);
    onClose();
  };

  const calculatedDayName = getDayNameIndonesian(date);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {currentMode === 'view'
                  ? 'Detail Kegiatan Marketing'
                  : currentMode === 'edit'
                  ? 'Edit Kegiatan Marketing'
                  : 'Tambah Kegiatan Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentMode === 'view'
                  ? `${activity?.dayName || ''}, ${activity?.date || ''}`
                  : 'Pastikan mematuhi aturan operasional hari kerja'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentMode === 'view' && (
              <button
                type="button"
                onClick={() => setCurrentMode('edit')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Validation Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* VIEW MODE */}
          {currentMode === 'view' && activity && (
            <div className="space-y-5">
              {/* Top Title & Badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getCategoryBadgeClass(
                      activity.category
                    )}`}
                  >
                    {activity.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusBadgeClass(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {formatIndonesianFull(activity.date)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {activity.title}
                </h2>
                {activity.pic && (
                  <p className="text-xs text-slate-500 mt-1">
                    <strong>Penanggung Jawab (PIC):</strong> {activity.pic}
                  </p>
                )}
              </div>

              {/* Detail Aktivitas */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Detail Aktivitas
                </span>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                  {activity.activityDetail}
                </p>
              </div>

              {/* Target / Output & Quick Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Target / Output
                  </span>
                  <p className="text-slate-900 font-semibold text-xs sm:text-sm">
                    {activity.targetOutput}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Ubah Status Cepat
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {statuses.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleQuickStatusChange(st)}
                        className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                          activity.status === st
                            ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checklist / Action Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Daftar Tugas / Checklist (
                    {checklist.filter((c) => c.completed).length}/{checklist.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Klik kotak untuk menandai selesai
                  </span>
                </div>

                <div className="space-y-1.5">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(item.id)}
                        className="flex items-center gap-2.5 text-left flex-1"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs ${
                            item.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-800 font-medium'
                          }`}
                        >
                          {item.text}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add checklist input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddChecklist();
                        }
                      }}
                      placeholder="Tambah tugas baru..."
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddChecklist()}
                      className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Catatan Evaluasi */}
              {activity.evaluationNotes && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-800">
                    Catatan Evaluasi / Rekomendasi
                  </span>
                  <p className="text-amber-900 leading-relaxed">
                    {activity.evaluationNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ADD / EDIT MODE FORM */}
          {(currentMode === 'add' || currentMode === 'edit') && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Produksi dan publikasi konten"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Tanggal & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Pelaksanaan * ({calculatedDayName})
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    {isWeekend(date) && (
                      <span className="text-red-600 font-semibold">
                        Peringatan: Sabtu/Minggu adalah hari libur!
                      </span>
                    )}
                    {isFriday(date) && (
                      <span className="text-emerald-700 font-semibold">
                        Jumat: Khusus kegiatan Evaluasi Mingguan.
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Kegiatan *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detail Aktivitas */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detail Aktivitas *
                </label>
                <textarea
                  rows={3}
                  required
                  value={activityDetail}
                  onChange={(e) => setActivityDetail(e.target.value)}
                  placeholder="Rincian aktivitas yang harus dijalankan..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Target/Output & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target / Output *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetOutput}
                    onChange={(e) => setTargetOutput(e.target.value)}
                    placeholder="Contoh: 3 video / Daftar 20–30 bengkel"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Kegiatan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ActivityStatus)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PIC Penanggung Jawab */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  placeholder="Contoh: Tim Konten / Field Marketing"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Checklist Items builder in form */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">
                  Sub-Tugas / Checklist
                </label>
                <div className="space-y-1.5">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <span className="text-xs text-slate-800">{item.text}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      placeholder="Tambah butir tugas..."
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddChecklist()}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Catatan Evaluasi */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Evaluasi (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={evaluationNotes}
                  onChange={(e) => setEvaluationNotes(e.target.value)}
                  placeholder="Catatan hasil pelaksanaan atau kendala..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMode === 'edit' && activity) {
                      setCurrentMode('view');
                    } else {
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm"
                >
                  {currentMode === 'edit' ? 'Simpan Perubahan' : 'Tambahkan ke Timeline'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer for View Mode */}
        {currentMode === 'view' && (
          <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between shrink-0">
            {onDelete && activity && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(activity);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Kegiatan</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
