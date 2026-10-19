import React from 'react';
import {
  Menu,
  Plus,
  Printer,
  Search,
  Calendar,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  onExportPdf: () => void;
  onResetData: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenAddModal,
  onExportPdf,
  onResetData,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left Title & Subtitle + Period */}
          <div className="flex items-start gap-3">
            {/* Hamburger button for mobile */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              aria-label="Buka navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Timeline Marketing
                </h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>20 Oktober – 18 November 2026</span>
                </div>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Perencanaan dan pemantauan kegiatan marketing Bengkelin
              </p>
            </div>
          </div>

          {/* Right Controls: Search, Export PDF, Tambah Kegiatan */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] sm:w-64 sm:flex-none">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kegiatan / detail..."
                className="w-full py-2 pl-9 pr-8 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Reset Data Button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset ke data bawaan 22 agenda"
              className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Export PDF Button */}
            <button
              type="button"
              onClick={onExportPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0 shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Export PDF</span>
            </button>

            {/* Tambah Kegiatan Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 active:bg-rose-800 transition-colors shrink-0 shadow-sm shadow-rose-600/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Kegiatan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
