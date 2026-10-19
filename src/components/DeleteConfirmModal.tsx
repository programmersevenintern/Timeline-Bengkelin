import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ActivityItem } from '../types/marketing';
import { formatToIndonesianDate } from '../utils/dateUtils';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  activity: ActivityItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  activity,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Hapus Kegiatan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] font-mono text-slate-500">
              {formatToIndonesianDate(activity.date, { showDay: true })}
            </div>
            <div className="text-sm font-bold text-slate-900">
              {activity.title}
            </div>
            <div className="text-xs text-slate-600 line-clamp-2">
              {activity.activityDetail}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus agenda kegiatan ini dari timeline marketing Bengkelin?
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
