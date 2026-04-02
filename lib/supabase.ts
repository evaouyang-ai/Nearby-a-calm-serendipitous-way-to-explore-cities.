// lib/supabase.ts
// Supabase client — used for auth and cloud scrapbook storage.
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing env vars. Auth and cloud storage won\'t work.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
