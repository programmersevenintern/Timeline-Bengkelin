import React from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  Calendar,
  Wrench,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'timeline' | 'calendar' | 'workshops' | 'evaluations';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  activityCount: number;
  completedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  activityCount,
  completedCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'timeline' as NavTab,
      label: 'Timeline Kegiatan',
      icon: CalendarRange,
      badge: `${activityCount}`,
    },
    {
      id: 'calendar' as NavTab,
      label: 'Kalender',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'workshops' as NavTab,
      label: 'Daftar Target Bengkel',
      icon: Wrench,
      badge: '25',
    },
    {
      id: 'evaluations' as NavTab,
      label: 'Evaluasi Mingguan',
      icon: ClipboardCheck,
      badge: '4 Jum',
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  const progressPercent = activityCount > 0 ? Math.round((completedCount / activityCount) * 100) : 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:static
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Bengkelin Red Logo Mark */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-600 text-white shrink-0 shadow-sm shadow-rose-200">
              <Wrench className="w-5 h-5 stroke-[2.2]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-slate-900 truncate">
                  Bengkelin
                </span>
                <span className="text-xs text-rose-600 font-medium tracking-wide truncate">
                  Marketing Timeline
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-500 rounded-lg lg:hidden hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Menu Navigasi
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-rose-600' : 'text-slate-500'
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-mono tabular-nums ${
                          isActive
                            ? 'bg-rose-200/70 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress & Quick Info Card */}
        {!collapsed && (
          <div className="p-4 mx-3 mb-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">Progres Timeline</span>
              <span className="text-xs font-mono font-bold text-rose-600 tabular-nums">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700">{completedCount}</span> dari {activityCount} kegiatan selesai
            </p>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-200">
          {!collapsed && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Bengkelin v1.0</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 ml-auto text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};
