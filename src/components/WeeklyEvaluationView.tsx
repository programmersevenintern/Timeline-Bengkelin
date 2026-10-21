import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Edit3,
  Save,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';
import { WeeklyEvaluation } from '../types/marketing';
import { formatIndonesianFull, getDayNameIndonesian } from '../utils/dateUtils';

interface WeeklyEvaluationViewProps {
  evaluations: WeeklyEvaluation[];
  onAddEvaluation: (evaluation: Omit<WeeklyEvaluation, 'id'>) => void;
  onUpdateEvaluation: (evaluation: WeeklyEvaluation) => void;
}

type EvaluationForm = Omit<WeeklyEvaluation, 'id'>;

const createEmptyEvaluation = (): EvaluationForm => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  return {
    date: localDate,
    dayName: getDayNameIndonesian(localDate),
    title: '',
    focus: '',
    achievedResults: '',
    obstacles: '',
    improvementPlan: '',
    additionalNotes: '',
    status: 'Draft',
  };
};

export const WeeklyEvaluationView: React.FC<WeeklyEvaluationViewProps> = ({
  evaluations,
  onAddEvaluation,
  onUpdateEvaluation,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WeeklyEvaluation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<EvaluationForm>(createEmptyEvaluation);

  const handleStartEdit = (evalItem: WeeklyEvaluation) => {
    setEditingId(evalItem.id);
    setFormData({ ...evalItem });
  };

  const handleSave = () => {
    if (formData) {
      onUpdateEvaluation(formData);
      setEditingId(null);
      setFormData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(null);
  };

  const handleAddEvaluation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddEvaluation({
      ...newEvaluation,
      date: newEvaluation.date,
      dayName: getDayNameIndonesian(newEvaluation.date),
      title: newEvaluation.title.trim(),
      focus: newEvaluation.focus.trim(),
    });
    setIsAddModalOpen(false);
    setNewEvaluation(createEmptyEvaluation());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Evaluasi
        </button>
      </div>

      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
          <ClipboardCheck className="w-5 h-5" />
          <span>Evaluasi Mingguan</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Catat hasil, kendala, rencana perbaikan, dan catatan tambahan untuk setiap evaluasi.
        </p>
      </div>

      {/* Evaluation entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluations.length === 0 && (
          <div className="lg:col-span-2 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Belum ada catatan evaluasi. Klik Tambah Evaluasi untuk mulai mengisi.
          </div>
        )}
        {evaluations.map((item, index) => {
          const isEditing = editingId === item.id;
          const currentItem = isEditing && formData ? formData : item;

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-2xs transition-all ${
                isEditing ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      Evaluasi #{index + 1}
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={currentItem.date}
                        onChange={(event) =>
                          setFormData({ ...currentItem, date: event.target.value, dayName: getDayNameIndonesian(event.target.value) })
                        }
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-700">
                        {formatIndonesianFull(item.date)}
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      value={currentItem.title}
                      onChange={(event) => setFormData({ ...currentItem, title: event.target.value })}
                      aria-label="Judul evaluasi"
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm font-bold"
                    />
                  ) : (
                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                  )}
                  <div className="text-xs text-slate-500 mt-0.5">
                    <strong>Fokus:</strong>{' '}
                    {isEditing ? (
                      <input
                        value={currentItem.focus}
                        onChange={(event) => setFormData({ ...currentItem, focus: event.target.value })}
                        aria-label="Fokus evaluasi"
                        className="w-full rounded border border-slate-300 px-2 py-1"
                      />
                    ) : item.focus}
                  </div>

                </div>

                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Catatan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* 1. Hasil yang dicapai */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hasil yang Dicapai</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={formData?.achievedResults}
                      onChange={(e) =>
                        setFormData(
                          formData ? { ...formData, achievedResults: e.target.value } : null
                        )
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 focus:bg-white"
                    />
                  ) : (
                    <p className="text-slate-700 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100 leading-relaxed">
                      {item.achievedResults || 'Belum diisi.'}
                    </p>
                  )}
                </div>

                {/* 2. Kendala yang dihadapi */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Kendala &amp; Hambatan</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData?.obstacles}
                      onChange={(e) =>
                        setFormData(
                          formData ? { ...formData, obstacles: e.target.value } : null
                        )
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 focus:bg-white"
                    />
                  ) : (
                    <p className="text-slate-700 bg-amber-50/40 p-3 rounded-lg border border-amber-100 leading-relaxed">
                      {item.obstacles || 'Belum ada kendala tercatat.'}
                    </p>
                  )}
                </div>

                {/* 3. Rencana perbaikan */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-800">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span>Rencana Perbaikan</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData?.improvementPlan}
                      onChange={(e) =>
                        setFormData(
                          formData ? { ...formData, improvementPlan: e.target.value } : null
                        )
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 focus:bg-white"
                    />
                  ) : (
                    <p className="text-slate-700 bg-blue-50/40 p-3 rounded-lg border border-blue-100 leading-relaxed">
                      {item.improvementPlan || 'Belum diisi.'}
                    </p>
                  )}
                </div>

                {/* 4. Catatan tambahan */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Catatan Tambahan</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData?.additionalNotes}
                      onChange={(e) =>
                        setFormData(
                          formData ? { ...formData, additionalNotes: e.target.value } : null
                        )
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 focus:bg-white"
                    />
                  ) : (
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                      {item.additionalNotes || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleAddEvaluation}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">Tambah Evaluasi Mingguan</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup form"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold text-slate-700">
                Tanggal
                <input
                  required
                  type="date"
                  value={newEvaluation.date}
                  onChange={(event) => setNewEvaluation({ ...newEvaluation, date: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-700">
                Judul
                <input
                  required
                  value={newEvaluation.title}
                  onChange={(event) => setNewEvaluation({ ...newEvaluation, title: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"
                  placeholder="Judul evaluasi"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-700 sm:col-span-2">
                Fokus
                <input
                  required
                  value={newEvaluation.focus}
                  onChange={(event) => setNewEvaluation({ ...newEvaluation, focus: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"
                  placeholder="Fokus evaluasi"
                />
              </label>
              {([
                ['achievedResults', 'Hasil yang dicapai'],
                ['obstacles', 'Kendala & hambatan'],
                ['improvementPlan', 'Rencana perbaikan'],
                ['additionalNotes', 'Catatan tambahan'],
              ] as const).map(([field, label]) => (
                <label key={field} className="space-y-1 text-xs font-semibold text-slate-700 sm:col-span-2">
                  {label}
                  <textarea
                    rows={2}
                    value={newEvaluation[field]}
                    onChange={(event) =>
                      setNewEvaluation({ ...newEvaluation, [field]: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
