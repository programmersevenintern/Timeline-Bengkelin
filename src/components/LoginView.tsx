import React, { useState } from 'react';
import { LockKeyhole, LogIn } from 'lucide-react';
import { supabase, supabaseConfigError } from '../lib/supabase';

export const SupabaseSetupView: React.FC = () => (
  <AuthPage>
    <div className="space-y-3 text-sm text-slate-600">
      <p className="font-semibold text-slate-900">Konfigurasi Supabase perlu diperbaiki.</p>
      {supabaseConfigError && <p role="alert">{supabaseConfigError}</p>}
      <p>
        Tambahkan <code className="rounded bg-slate-100 px-1">VITE_SUPABASE_URL</code> dan{' '}
        <code className="rounded bg-slate-100 px-1">VITE_SUPABASE_ANON_KEY</code> ke file{' '}
        <code className="rounded bg-slate-100 px-1">.env</code>, lalu mulai ulang aplikasi.
      </p>
      <p>
        Gunakan anon/publishable key, bukan service-role key atau DATABASE_URL.
      </p>
    </div>
  </AuthPage>
);

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Supabase sign-in failed', error);
      if (error instanceof Error && error.message === 'Email not confirmed') {
        setErrorMessage(
          'Email akun belum dikonfirmasi. Konfirmasikan akun di Supabase Dashboard > Authentication > Users, lalu coba login lagi.'
        );
      } else {
        setErrorMessage('Login gagal. Periksa email dan kata sandi, lalu coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPage>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            required
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">Kata sandi</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
          />
        </label>
        {errorMessage && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          {isSubmitting ? 'Sedang masuk...' : 'Masuk'}
        </button>
      </form>
      <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
        Akun tim dibuat satu kali oleh administrator di Supabase Dashboard. Pendaftaran publik
        tidak tersedia di halaman ini.
      </p>
    </AuthPage>
  );
};

const AuthPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-rose-600 p-3 text-white">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Marketing Bengkelin</h1>
          <p className="text-sm text-slate-500">Masuk untuk membuka data tim</p>
        </div>
      </div>
      {children}
    </section>
  </main>
);
