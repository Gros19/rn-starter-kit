/**
 * Supabase 클라이언트 (채팅 Realtime + Storage)
 * npm install @supabase/supabase-js
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { mmkvStorage } from '@/lib/utils/storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** MMKV 기반 커스텀 스토리지 for Supabase auth */
const supabaseStorage = {
  getItem: (key: string) => Promise.resolve(mmkvStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    mmkvStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    mmkvStorage.removeItem(key);
    return Promise.resolve();
  },
};

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase URL과 Anon Key를 설정해주세요 (.env)');
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: supabaseStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabase;
}
