import React, { useMemo, useState } from 'react';
import { AlertTriangle, Copy, KeyRound, LockKeyhole, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { SocialAccount } from '../types/marketing';

interface SocialAccountsViewProps {
  accounts: SocialAccount[];
  onAddAccount: (account: Omit<SocialAccount, 'id'>) => void;
  onUpdateAccount: (account: SocialAccount) => void;
  onDeleteAccount: (account: SocialAccount) => void;
  onNotify: (message: string) => void;
}

type SocialAccountForm = Omit<SocialAccount, 'id'>;

const createEmptyForm = (): SocialAccountForm => ({
  platform: '',
  accountName: '',
  password: '',
});

export const SocialAccountsView: React.FC<SocialAccountsViewProps> = ({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onNotify,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [formData, setFormData] = useState<SocialAccountForm>(createEmptyForm);

  const filteredAccounts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return accounts;
    return accounts.filter(
      (account) =>
        account.platform.toLowerCase().includes(query) ||
        account.accountName.toLowerCase().includes(query)
    );
  }, [accounts, searchTerm]);

  const openAddForm = () => {
    setEditingAccount(null);
    setFormData(createEmptyForm());
    setIsFormOpen(true);
  };

  const openEditForm = (account: SocialAccount) => {
    setEditingAccount(account);
    setFormData({
      platform: account.platform,
      accountName: account.accountName,
      password: '',
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
    setFormData(createEmptyForm());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const platform = formData.platform.trim();
    const accountName = formData.accountName.trim();
    const password = formData.password;

    if (!platform || !accountName || (!editingAccount && !password)) return;

    if (editingAccount) {
      onUpdateAccount({
        ...editingAccount,
        platform,
        accountName,
        password: password || editingAccount.password,
      });
    } else {
      onAddAccount({ platform, accountName, password });
    }
    closeForm();
  };

  const copyPassword = async (account: SocialAccount) => {
    try {
      await navigator.clipboard.writeText(account.password);
      onNotify(`Kata sandi akun ${account.platform} berhasil disalin.`);
    } catch (error) {
      console.error('Failed to copy social account password', error);
      onNotify('Kata sandi tidak dapat disalin. Periksa izin clipboard browser.');
    }
  };

  const handleDelete = (account: SocialAccount) => {
    if (window.confirm(`Hapus catatan akun ${account.platform} (${account.accountName})?`)) {
      onDeleteAccount(account);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Catatan Sosmed</h2>
          <p className="mt-1 text-sm text-slate-500">
            Simpan nama platform, akun, dan kata sandi untuk kebutuhan tim.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Akun
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed">
          Kata sandi disamarkan di tampilan, tetapi tersimpan sebagai data akun tim di Supabase.
          Siapa pun yang memakai akun tim dapat menyalinnya, dan administrator proyek dapat membaca
          data tabel. Hindari kata sandi penting atau yang digunakan ulang.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Cari platform atau nama akun..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
        />
      </div>

      {filteredAccounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <LockKeyhole className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            {accounts.length === 0 ? 'Belum ada catatan akun sosmed.' : 'Akun tidak ditemukan.'}
          </p>
          {accounts.length === 0 && (
            <p className="mt-1 text-xs text-slate-500">Tambahkan akun pertama untuk mulai mencatat.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAccounts.map((account) => (
            <article
              key={account.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900">{account.platform}</h3>
                    <p className="truncate text-sm text-slate-500">{account.accountName}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditForm(account)}
                    aria-label={`Edit akun ${account.platform}`}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(account)}
                    aria-label={`Hapus akun ${account.platform}`}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Kata sandi
                  </p>
                  <p className="mt-0.5 font-mono tracking-widest text-slate-600" aria-label="Kata sandi disembunyikan">
                    ••••••••
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyPassword(account)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-700"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Salin
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">
                {editingAccount ? 'Edit Catatan Akun' : 'Tambah Catatan Akun'}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Tutup form"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Nama platform</span>
                <input
                  autoFocus
                  required
                  value={formData.platform}
                  onChange={(event) => setFormData({ ...formData, platform: event.target.value })}
                  placeholder="Contoh: Instagram"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Nama akun</span>
                <input
                  required
                  value={formData.accountName}
                  onChange={(event) => setFormData({ ...formData, accountName: event.target.value })}
                  placeholder="Contoh: @bengkelin.id"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Kata sandi</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required={!editingAccount}
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder={editingAccount ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan kata sandi'}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                />
                {editingAccount && (
                  <span className="block text-[11px] text-slate-500">
                    Kata sandi lama tidak ditampilkan. Isi hanya jika ingin menggantinya.
                  </span>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={closeForm}
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
