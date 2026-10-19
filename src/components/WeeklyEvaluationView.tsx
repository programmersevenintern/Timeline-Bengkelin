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
} from 'lucide-react';
import { WeeklyEvaluation } from '../types/marketing';
import { formatIndonesianFull } from '../utils/dateUtils';

interface WeeklyEvaluationViewProps {
  evaluations: WeeklyEvaluation[];
  onUpdateEvaluation: (evaluation: WeeklyEvaluation) => void;
}

export const WeeklyEvaluationView: React.FC<WeeklyEvaluationViewProps> = ({
  evaluations,
  onUpdateEvaluation,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WeeklyEvaluation | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Informational Header Banner */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
          <ClipboardCheck className="w-5 h-5" />
          <span>Sesi Evaluasi Mingguan (Khusus Hari Jumat)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Sesuai SOP Marketing Bengkelin, setiap hari Jumat dikhususkan untuk evaluasi menyeluruh dari hasil eksekusi Senin–Kamis. Tidak diperkenankan menjadwalkan produksi konten baru, kunjungan bengkel, atau event promosi pada hari Jumat.
        </p>
      </div>

      {/* Grid of 4 Friday Evaluations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      Jumat #{index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatIndonesianFull(item.date)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <strong>Fokus:</strong> {item.focus}
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
    </div>
  );
};
