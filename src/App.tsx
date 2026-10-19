import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { TimelineTable } from './components/TimelineTable';
import { CalendarView } from './components/CalendarView';
import { WorkshopTargetsView } from './components/WorkshopTargetsView';
import { WeeklyEvaluationView } from './components/WeeklyEvaluationView';
import { ActivityModal } from './components/ActivityModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ActivityItem, WorkshopTarget, WeeklyEvaluation, ActivityStatus } from './types/marketing';
import { INITIAL_ACTIVITIES, INITIAL_WORKSHOPS, INITIAL_EVALUATIONS } from './data/initialData';
import { formatToIndonesianDate, formatIndonesianFull } from './utils/dateUtils';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function App() {
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Activities State with localStorage persistence
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('bengkelin_activities_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading activities from localStorage', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Workshop Targets State with localStorage persistence
  const [workshops, setWorkshops] = useState<WorkshopTarget[]>(() => {
    try {
      const saved = localStorage.getItem('bengkelin_workshops_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading workshops from localStorage', e);
    }
    return INITIAL_WORKSHOPS;
  });

  // Weekly Evaluations State with localStorage persistence
  const [evaluations, setEvaluations] = useState<WeeklyEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem('bengkelin_evaluations_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading evaluations from localStorage', e);
    }
    return INITIAL_EVALUATIONS;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('bengkelin_activities_v1', JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('bengkelin_workshops_v1', JSON.stringify(workshops));
    } catch (e) {
      console.error('Failed to save workshops to localStorage', e);
    }
  }, [workshops]);

  useEffect(() => {
    try {
      localStorage.setItem('bengkelin_evaluations_v1', JSON.stringify(evaluations));
    } catch (e) {
      console.error('Failed to save evaluations to localStorage', e);
    }
  }, [evaluations]);

  // Modal States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<ActivityItem | null>(null);

  // Handlers for Activities
  const handleOpenAddModal = (presetDate?: string) => {
    setSelectedActivity(
      presetDate
        ? {
            id: '',
            date: presetDate,
            dayName: '',
            title: '',
            category: 'Persiapan',
            activityDetail: '',
            targetOutput: '',
            status: 'Belum Dimulai',
            checklist: [],
          }
        : null
    );
    setModalMode('add');
    setIsActivityModalOpen(true);
  };

  const handleOpenViewModal = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setModalMode('view');
    setIsActivityModalOpen(true);
  };

  const handleOpenEditModal = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setModalMode('edit');
    setIsActivityModalOpen(true);
  };

  const handleOpenDeleteModal = (activity: ActivityItem) => {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (activityToDelete) {
      setActivities((prev) => prev.filter((a) => a.id !== activityToDelete.id));
      showToast(`Kegiatan "${activityToDelete.title}" berhasil dihapus.`);
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleSaveActivity = (savedItem: ActivityItem) => {
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === savedItem.id);
      if (exists) {
        return prev.map((a) => (a.id === savedItem.id ? savedItem : a));
      } else {
        // Add new and sort by date
        const next = [...prev, savedItem];
        next.sort((a, b) => a.date.localeCompare(b.date));
        return next;
      }
    });

    if (modalMode === 'add') {
      showToast(`Kegiatan "${savedItem.title}" berhasil ditambahkan.`);
    } else {
      showToast(`Perubahan kegiatan "${savedItem.title}" tersimpan.`);
    }

    setSelectedActivity(savedItem);
  };

  const handleUpdateStatus = (id: string, status: ActivityStatus) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Status kegiatan diperbarui menjadi "${status}".`);
  };

  // Workshop Handlers
  const handleAddWorkshop = (newWs: Omit<WorkshopTarget, 'id'>) => {
    const wsWithId: WorkshopTarget = {
      ...newWs,
      id: `ws-${Date.now()}`,
    };
    setWorkshops((prev) => [wsWithId, ...prev]);
    showToast(`Target bengkel "${wsWithId.name}" berhasil ditambahkan.`);
  };

  const handleUpdateWorkshop = (updatedWorkshop: WorkshopTarget) => {
    setWorkshops((prev) =>
      prev.map((workshop) => (workshop.id === updatedWorkshop.id ? updatedWorkshop : workshop))
    );
    showToast(`Perubahan target bengkel "${updatedWorkshop.name}" tersimpan.`);
  };

  const handleUpdateWorkshopStatus = (id: string, status: WorkshopTarget['visitStatus']) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visitStatus: status } : w))
    );
    showToast(`Status bengkel diperbarui menjadi "${status}".`);
  };

  const handleDeleteWorkshop = (id: string) => {
    const workshop = workshops.find((item) => item.id === id);
    setWorkshops((prev) => prev.filter((item) => item.id !== id));
    if (workshop) {
      showToast(`Target bengkel "${workshop.name}" berhasil dihapus.`);
    }
  };

  // Weekly Evaluation Handlers
  const handleUpdateEvaluation = (updated: WeeklyEvaluation) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    showToast(`Catatan evaluasi "${updated.title}" berhasil disimpan.`);
  };

  // Reset to initial seed data
  const handleResetData = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mereset seluruh timeline kegiatan marketing ke data awal 22 agenda bawaan?'
      )
    ) {
      setActivities(INITIAL_ACTIVITIES);
      setWorkshops(INITIAL_WORKSHOPS);
      setEvaluations(INITIAL_EVALUATIONS);
      localStorage.removeItem('bengkelin_activities_v1');
      localStorage.removeItem('bengkelin_workshops_v1');
      localStorage.removeItem('bengkelin_evaluations_v1');
      showToast('Seluruh data berhasil direset ke jadwal default 20 Okt – 18 Nov 2026.');
    }
  };

  // Export PDF Handler
  const handleExportPdf = () => {
    window.print();
  };

  const completedActivitiesCount = activities.filter((a) => a.status === 'Selesai').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          activityCount={activities.length}
          completedCount={completedActivitiesCount}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenAddModal={() => handleOpenAddModal()}
            onExportPdf={handleExportPdf}
            onResetData={handleResetData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Main Views Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* View Switcher based on currentTab */}
            {currentTab === 'dashboard' && (
              <DashboardOverview
                activities={activities}
                workshops={workshops}
                evaluations={evaluations}
                onSelectActivity={handleOpenViewModal}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'timeline' && (
              <TimelineTable
                activities={activities}
                searchTerm={searchTerm}
                onSelectActivity={handleOpenViewModal}
                onEditActivity={handleOpenEditModal}
                onDeleteActivity={handleOpenDeleteModal}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView
                activities={activities}
                onSelectActivity={handleOpenViewModal}
                onOpenAddModalWithDate={(dateStr) => handleOpenAddModal(dateStr)}
              />
            )}

            {currentTab === 'workshops' && (
              <WorkshopTargetsView
                workshops={workshops}
                onAddWorkshop={handleAddWorkshop}
                onUpdateWorkshop={handleUpdateWorkshop}
                onUpdateWorkshopStatus={handleUpdateWorkshopStatus}
                onDeleteWorkshop={handleDeleteWorkshop}
              />
            )}

            {currentTab === 'evaluations' && (
              <WeeklyEvaluationView
                evaluations={evaluations}
                onUpdateEvaluation={handleUpdateEvaluation}
              />
            )}
          </main>
        </div>
      </div>

      {/* PRINT-ONLY EXECUTIVE PDF REPORT (Activated upon window.print()) */}
      <div className="print-only p-8 text-black bg-white">
        <div className="border-b-2 border-red-600 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                BENGKELIN — TIMELINE MARKETING BULANAN
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Perencanaan &amp; Pemantauan Kegiatan Promosi Periode 20 Oktober – 18 November 2026
              </p>
            </div>
            <div className="text-right text-xs text-gray-500 font-mono">
              Dicetak: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 block">Total Kegiatan:</span>
              <strong className="text-sm">{activities.length} Agenda</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Target Video:</span>
              <strong className="text-sm">Maks. 66 Video</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Target Bengkel:</span>
              <strong className="text-sm">20-30 Petakan / 10-15 Kunjungi</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Target Webinar:</span>
              <strong className="text-sm">1 Acara (9 Nov 2026)</strong>
            </div>
          </div>
        </div>

        <h2 className="text-base font-bold mb-3">Tabel Agenda Timeline Kegiatan</h2>
        <table className="w-full text-xs border border-gray-300 mb-8">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="p-2 border border-gray-300 w-8 text-center">No</th>
              <th className="p-2 border border-gray-300 w-28">Tanggal</th>
              <th className="p-2 border border-gray-300">Kegiatan</th>
              <th className="p-2 border border-gray-300 w-28">Kategori</th>
              <th className="p-2 border border-gray-300">Detail Aktivitas</th>
              <th className="p-2 border border-gray-300 w-32">Target/Output</th>
              <th className="p-2 border border-gray-300 w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act, i) => (
              <tr key={act.id}>
                <td className="p-2 border border-gray-300 text-center font-mono">{i + 1}</td>
                <td className="p-2 border border-gray-300 whitespace-nowrap">
                  {formatToIndonesianDate(act.date, { showDay: true })}
                </td>
                <td className="p-2 border border-gray-300 font-bold">{act.title}</td>
                <td className="p-2 border border-gray-300">{act.category}</td>
                <td className="p-2 border border-gray-300 text-gray-700">{act.activityDetail}</td>
                <td className="p-2 border border-gray-300">{act.targetOutput}</td>
                <td className="p-2 border border-gray-300 font-semibold">{act.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-break-inside-avoid mt-8 pt-4 border-t border-gray-200 flex justify-between text-xs">
          <div>
            <p className="text-gray-500">Disusun oleh:</p>
            <p className="mt-12 font-bold underline">Tim Marketing Bengkelin</p>
          </div>
          <div>
            <p className="text-gray-500">Disetujui oleh:</p>
            <p className="mt-12 font-bold underline">Direktur Operasional Bengkelin</p>
          </div>
        </div>
      </div>

      {/* Activity Details / Add / Edit Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activity={selectedActivity}
        mode={modalMode}
        onSave={handleSaveActivity}
        onDelete={handleOpenDeleteModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        activity={activityToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setActivityToDelete(null);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
