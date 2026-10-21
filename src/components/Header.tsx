import React from 'react';
import { LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  userEmail: string;
  onSignOut: () => void;
  syncStatus: 'loading' | 'saving' | 'saved' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  userEmail,
  onSignOut,
  syncStatus,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500 lg:hidden"
          aria-label="Buka navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Marketing Bengkelin</h1>
          <p className="truncate text-xs text-slate-500">{userEmail}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`hidden text-xs sm:block ${
              syncStatus === 'error' ? 'text-red-600' : 'text-emerald-700'
            }`}
            role="status"
          >
            {syncStatus === 'loading'
              ? 'Memuat data...'
              : syncStatus === 'saving'
                ? 'Menyimpan...'
                : syncStatus === 'error'
                  ? 'Gagal menyimpan'
                  : 'Tersimpan'}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
};
