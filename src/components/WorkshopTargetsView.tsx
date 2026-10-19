import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Store,
  Phone,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Filter,
  User,
  ChevronDown,
} from 'lucide-react';
import { WorkshopTarget } from '../types/marketing';

interface WorkshopTargetsViewProps {
  workshops: WorkshopTarget[];
  onAddWorkshop: (workshop: Omit<WorkshopTarget, 'id'>) => void;
  onUpdateWorkshopStatus: (id: string, status: WorkshopTarget['visitStatus']) => void;
}

export const WorkshopTargetsView: React.FC<WorkshopTargetsViewProps> = ({
  workshops,
  onAddWorkshop,
  onUpdateWorkshopStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New workshop form state
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    phone: '',
    address: '',
    district: '',
    type: 'Motor' as WorkshopTarget['type'],
    visitStatus: 'Belum Dikunjungi' as WorkshopTarget['visitStatus'],
    notes: '',
    visitDate: '',
  });

  // Filtered workshops
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((w) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = w.name.toLowerCase().includes(query);
        const matchesOwner = w.owner.toLowerCase().includes(query);
        const matchesDistrict = w.district.toLowerCase().includes(query);
        const matchesPhone = w.phone.toLowerCase().includes(query);
        if (!matchesName && !matchesOwner && !matchesDistrict && !matchesPhone) return false;
      }

      if (statusFilter !== 'all' && w.visitStatus !== statusFilter) return false;
      if (typeFilter !== 'all' && w.type !== typeFilter) return false;

      return true;
    });
  }, [workshops, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const totalMapped = workshops.length;
  const visitedCount = workshops.filter(
    (w) => w.visitStatus === 'Sudah Dikunjungi' || w.visitStatus === 'Tertarik Demo' || w.visitStatus === 'Onboarding'
  ).length;
  const scheduledCount = workshops.filter((w) => w.visitStatus === 'Terjadwal').length;
  const interestedCount = workshops.filter((w) => w.visitStatus === 'Tertarik Demo').length;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) return;
    onAddWorkshop(formData);
    setFormData({
      name: '',
      owner: '',
      phone: '',
      address: '',
      district: '',
      type: 'Motor',
      visitStatus: 'Belum Dikunjungi',
      notes: '',
      visitDate: '',
    });
    setShowAddModal(false);
  };

  const getStatusStyle = (st: WorkshopTarget['visitStatus']) => {
    switch (st) {
      case 'Sudah Dikunjungi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tertarik Demo':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Terjadwal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Follow-up':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Onboarding':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Target Pemetaan
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalMapped}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 20–30 bengkel</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target kuota terpenuhi (25 bengkel)</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Target Kunjungan
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {visitedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 10–15 bengkel</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            +{scheduledCount} kunjungan terjadwal
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Tertarik Demo / Fitur
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-700 tabular-nums">
              {interestedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">bengkel prioritas</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 font-medium">
            Prospek konversi tinggi
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Aksi Lapangan
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Target Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama bengkel, pemilik, kecamatan..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden focus:border-rose-500"
            >
              <option value="all">Semua Status Kunjungan</option>
              <option value="Belum Dikunjungi">Belum Dikunjungi</option>
              <option value="Terjadwal">Terjadwal</option>
              <option value="Sudah Dikunjungi">Sudah Dikunjungi</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Tertarik Demo">Tertarik Demo</option>
              <option value="Onboarding">Onboarding</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden focus:border-rose-500"
            >
              <option value="all">Semua Jenis Bengkel</option>
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
              <option value="Campuran">Campuran</option>
              <option value="Spesialis AC/Kaki-kaki">Spesialis AC/Kaki-kaki</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workshop List Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                <th className="py-3 px-3.5 w-12 text-center">No.</th>
                <th className="py-3 px-3.5 min-w-[200px]">Nama Bengkel &amp; Jenis</th>
                <th className="py-3 px-3.5 min-w-[150px]">Pemilik &amp; Kontak</th>
                <th className="py-3 px-3.5 min-w-[220px]">Alamat &amp; Lokasi</th>
                <th className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">Status Kunjungan</th>
                <th className="py-3 px-3.5 min-w-[200px]">Catatan Kebutuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkshops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada bengkel yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredWorkshops.map((ws, idx) => (
                  <tr key={ws.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Nama & Jenis */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-900">{ws.name}</div>
                      <div className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        Bengkel {ws.type}
                      </div>
                    </td>

                    {/* Pemilik & Kontak */}
                    <td className="py-3.5 px-3.5 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ws.owner}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{ws.phone}</span>
                      </div>
                    </td>

                    {/* Alamat */}
                    <td className="py-3.5 px-3.5 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <div>{ws.address}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            Kec. {ws.district}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={ws.visitStatus}
                          onChange={(e) =>
                            onUpdateWorkshopStatus(
                              ws.id,
                              e.target.value as WorkshopTarget['visitStatus']
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border appearance-none pr-6 cursor-pointer focus:outline-hidden ${getStatusStyle(
                            ws.visitStatus
                          )}`}
                        >
                          <option value="Belum Dikunjungi">Belum Dikunjungi</option>
                          <option value="Terjadwal">Terjadwal</option>
                          <option value="Sudah Dikunjungi">Sudah Dikunjungi</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Tertarik Demo">Tertarik Demo</option>
                          <option value="Onboarding">Onboarding</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none opacity-60" />
                      </div>
                      {ws.visitDate && (
                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          Tgl: {ws.visitDate}
                        </div>
                      )}
                    </td>

                    {/* Catatan Kebutuhan */}
                    <td className="py-3.5 px-3.5 text-xs text-slate-600 leading-relaxed">
                      {ws.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Workshop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Target Bengkel Sasaran
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bengkel *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Bengkel Sentosa Abadi"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pemilik / PIC
                  </label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="Contoh: Pak Budi"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / Telp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Bengkel
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as WorkshopTarget['type'] })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="Mobil">Mobil</option>
                    <option value="Motor">Motor</option>
                    <option value="Campuran">Campuran</option>
                    <option value="Spesialis AC/Kaki-kaki">Spesialis AC/Kaki-kaki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan / Area
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Contoh: Jatinegara"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Raya No..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Kebutuhan / Pain Point
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Misal: Sering selisih stok spare part, butuh software kasir..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700"
                >
                  Simpan Target Bengkel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
