import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { TimelineTable } from './components/TimelineTable';
import { WorkshopTargetsView } from './components/WorkshopTargetsView';
import { WeeklyEvaluationView } from './components/WeeklyEvaluationView';
import { ActivityModal } from './components/ActivityModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ActivityItem, WorkshopTarget, WeeklyEvaluation, ActivityStatus, SocialAccount } from './types/marketing';
import { formatToIndonesianDate } from './utils/dateUtils';
import { CheckCircle2, Info, X } from 'lucide-react';
import { SocialAccountsView } from './components/SocialAccountsView';
import { LoginView, SupabaseSetupView } from './components/LoginView';
import { isSupabaseConfigured, supabase } from './lib/supabase';

interface SharedAppData {
  activities: ActivityItem[];
  workshops: WorkshopTarget[];
  evaluations: WeeklyEvaluation[];
  socialAccounts: SocialAccount[];
}

const isSharedAppData = (value: unknown): value is SharedAppData => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return (
    Array.isArray(data.activities) &&
    Array.isArray(data.workshops) &&
    Array.isArray(data.evaluations) &&
    Array.isArray(data.socialAccounts)
  );
};

export default function App() {
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<NavTab>('timeline');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading');
  const [reloadDataKey, setReloadDataKey] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Shared state is loaded from Supabase after authentication.
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopTarget[]>([]);
  const [evaluations, setEvaluations] = useState<WeeklyEvaluation[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthUser(session?.user ?? null);
      setAuthReady(true);
      if (!session?.user) {
        setDataReady(false);
        setDataError(null);
        setSyncStatus('loading');
        setActivities([]);
        setWorkshops([]);
        setEvaluations([]);
        setSocialAccounts([]);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error('Failed to restore Supabase session', error);
          setDataError('Sesi login tidak dapat diperiksa. Muat ulang halaman atau login kembali.');
        }
        setAuthUser(data.session?.user ?? null);
        setAuthReady(true);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Failed to restore Supabase session', error);
        setDataError('Sesi login tidak dapat diperiksa. Muat ulang halaman atau login kembali.');
        setAuthReady(true);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !authUser) return;
    const client = supabase;

    let active = true;
    setDataReady(false);
    setDataError(null);
    setSyncStatus('loading');

    const loadSharedData = async () => {
      try {
        const { data, error } = await client
          .from('marketing_app_state')
          .select('data')
          .eq('id', 'shared')
          .maybeSingle();
        if (!active) return;
        if (error) {
          console.error('Failed to load shared app data from Supabase', error);
          setDataError('Data Supabase gagal dimuat. Periksa koneksi, tabel, dan RLS, lalu coba lagi.');
          setSyncStatus('error');
          return;
        }

        if (data && !isSharedAppData(data.data)) {
          console.error('Supabase shared app data has an invalid structure');
          setDataError('Format data Supabase tidak sesuai. Periksa isi tabel marketing_app_state.');
          setSyncStatus('error');
          return;
        }

        const sharedData = data?.data;
        setActivities(sharedData?.activities ?? []);
        setWorkshops(sharedData?.workshops ?? []);
        setEvaluations(sharedData?.evaluations ?? []);
        setSocialAccounts(sharedData?.socialAccounts ?? []);
        setDataReady(true);
        setSyncStatus('saved');
      } catch (error) {
        if (!active) return;
        console.error('Failed to load shared app data from Supabase', error);
        setDataError('Data Supabase gagal dimuat. Periksa koneksi, tabel, dan RLS, lalu coba lagi.');
        setSyncStatus('error');
      }
    };

    void loadSharedData();

    return () => {
      active = false;
    };
  }, [authUser?.id, reloadDataKey]);

  useEffect(() => {
    if (!supabase || !authUser || !dataReady) return;
    const client = supabase;

    const saveTimer = window.setTimeout(async () => {
      setSyncStatus('saving');
      try {
        const { error } = await client.from('marketing_app_state').upsert({
          id: 'shared',
          data: { activities, workshops, evaluations, socialAccounts },
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        setSyncStatus('saved');
      } catch (error) {
        console.error('Failed to save shared app data to Supabase', error);
        setSyncStatus('error');
        showToast('Perubahan gagal disimpan ke Supabase. Periksa koneksi lalu coba lagi.');
      }
    }, 400);

    return () => window.clearTimeout(saveTimer);
  }, [authUser?.id, dataReady, activities, workshops, evaluations, socialAccounts]);

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

  const handleAddSocialAccount = (account: Omit<SocialAccount, 'id'>) => {
    setSocialAccounts((prev) => [{ ...account, id: `social-${Date.now()}` }, ...prev]);
    showToast(`Akun ${account.platform} berhasil ditambahkan.`);
  };

  const handleUpdateSocialAccount = (account: SocialAccount) => {
    setSocialAccounts((prev) =>
      prev.map((savedAccount) => (savedAccount.id === account.id ? account : savedAccount))
    );
    showToast(`Akun ${account.platform} berhasil diperbarui.`);
  };

  const handleDeleteSocialAccount = (account: SocialAccount) => {
    setSocialAccounts((prev) => prev.filter((savedAccount) => savedAccount.id !== account.id));
    showToast(`Akun ${account.platform} berhasil dihapus.`);
  };

  // Weekly Evaluation Handlers
  const handleUpdateEvaluation = (updated: WeeklyEvaluation) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    showToast(`Catatan evaluasi "${updated.title}" berhasil disimpan.`);
  };

  const handleAddEvaluation = (evaluation: Omit<WeeklyEvaluation, 'id'>) => {
    setEvaluations((prev) => [{ ...evaluation, id: `eval-${Date.now()}` }, ...prev]);
    showToast(`Catatan evaluasi "${evaluation.title}" berhasil ditambahkan.`);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Hapus seluruh data kegiatan, target bengkel, evaluasi, dan catatan sosmed yang tersimpan? Tindakan ini tidak dapat dibatalkan.'
      )
    ) {
      setActivities([]);
      setWorkshops([]);
      setEvaluations([]);
      setSocialAccounts([]);
      showToast('Seluruh data berhasil dihapus.');
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign-out failed', error);
      showToast('Gagal keluar. Silakan coba lagi.');
    }
  };

  // Export PDF Handler
  const handleExportPdf = () => {
    window.print();
  };

  if (!isSupabaseConfigured) {
    return <SupabaseSetupView />;
  }

  if (!authReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Memeriksa sesi login...</div>;
  }

  if (!authUser) {
    return <LoginView />;
  }

  if (dataError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <section className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Data belum dapat dibuka</h1>
          <p role="alert" className="text-sm text-red-700">{dataError}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReloadDataKey((value) => value + 1)}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Coba lagi
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Keluar
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!dataReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Memuat data tim dari Supabase...</div>;
  }

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
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            userEmail={authUser.email ?? 'Akun tim'}
            onSignOut={handleSignOut}
            syncStatus={syncStatus}
          />

          {/* Main Views Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* View Switcher based on currentTab */}
            {currentTab === 'timeline' && (
              <TimelineTable
                activities={activities}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddActivity={() => handleOpenAddModal()}
                onExportPdf={handleExportPdf}
                onResetData={handleResetData}
                onSelectActivity={handleOpenViewModal}
                onEditActivity={handleOpenEditModal}
                onDeleteActivity={handleOpenDeleteModal}
                onUpdateStatus={handleUpdateStatus}
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
                onAddEvaluation={handleAddEvaluation}
                onUpdateEvaluation={handleUpdateEvaluation}
              />
            )}

            {currentTab === 'social-accounts' && (
              <SocialAccountsView
                accounts={socialAccounts}
                onAddAccount={handleAddSocialAccount}
                onUpdateAccount={handleUpdateSocialAccount}
                onDeleteAccount={handleDeleteSocialAccount}
                onNotify={showToast}
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
                Perencanaan &amp; Pemantauan Kegiatan Promosi
              </p>
            </div>
            <div className="text-right text-xs text-gray-500 font-mono">
              Dicetak: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 text-xs">
            <span className="text-gray-500">Total Kegiatan:</span>{' '}
            <strong className="text-sm">{activities.length} Agenda</strong>
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
