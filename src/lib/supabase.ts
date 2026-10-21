import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const isValidSupabaseUrl = (value: string | undefined) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const supabaseConfigError = !supabaseUrl
  ? 'VITE_SUPABASE_URL belum diisi.'
  : !isValidSupabaseUrl(supabaseUrl)
    ? 'VITE_SUPABASE_URL harus berupa Project URL Supabase yang diawali https://.'
    : !supabaseAnonKey
      ? 'VITE_SUPABASE_ANON_KEY belum diisi.'
      : null;

export const isSupabaseConfigured = supabaseConfigError === null;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
