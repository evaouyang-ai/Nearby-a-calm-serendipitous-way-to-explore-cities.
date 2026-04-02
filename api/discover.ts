// api/discover.ts — Vercel Serverless Function
// Returns public walks for the discover map, filtered by city.
// No auth required — fully public.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { city, limit = '20', offset = '0' } = req.query;

  let query = supabase
    .from('public_walks')
    .select('id, journey_id, city, plan, created_at')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (city && typeof city === 'string') {
    query = query.eq('city', city.trim().toLowerCase());
  }

  const { data, error } = await query;

  if (error) {
    console.error('[discover] error:', error.message);
    return res.status(500).json({ error: 'Could not load walks' });
  }

  // Set cache header — public, 5 min cache is fine
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  res.json({ walks: data ?? [] });
}
