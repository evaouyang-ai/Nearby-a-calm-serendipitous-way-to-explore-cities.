// lib/scrapbookStore.ts
// Cloud scrapbook via Supabase. Falls back to localStorage if not logged in.

import { supabase } from './supabase';
import type { JourneyMemory } from '../types';

const LOCAL_KEY = 'nearby_memories';

// ── Read ──────────────────────────────────────────────────────────────────────

export async function loadMemories(): Promise<JourneyMemory[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[scrapbook] load error:', error.message);
      return loadLocal();
    }

    return (data ?? []).map((row: any) => ({
      id: row.id,
      plan: row.plan,
      citations: row.citations ?? [],
      timestamp: new Date(row.created_at).getTime(),
    }));
  }

  return loadLocal();
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function saveMemory(memory: JourneyMemory): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.from('journeys').insert({
      id: memory.id,
      user_id: user.id,
      plan: memory.plan,
      citations: memory.citations,
    });
    if (error) console.error('[scrapbook] save error:', error.message);
  } else {
    // Not logged in → save locally
    const local = loadLocal();
    const deduped = [memory, ...local.filter(m => m.id !== memory.id)].slice(0, 50);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(deduped));
  }
}

// ── Migrate local → cloud on login ───────────────────────────────────────────

export async function migrateLocalToCloud(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const local = loadLocal();
  if (local.length === 0) return;

  const rows = local.map(m => ({
    id: m.id,
    user_id: user.id,
    plan: m.plan,
    citations: m.citations,
  }));

  const { error } = await supabase
    .from('journeys')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });

  if (!error) {
    localStorage.removeItem(LOCAL_KEY);
    console.log(`[scrapbook] migrated ${local.length} local memories to cloud`);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadLocal(): JourneyMemory[] {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
