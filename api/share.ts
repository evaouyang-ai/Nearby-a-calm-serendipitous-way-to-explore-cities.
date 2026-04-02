// api/share.ts — Vercel Serverless Function
// Publishes a journey to the public discover map (anonymous, opt-in).
// Requires auth via Supabase JWT.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify the user's JWT from the Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  const { journeyId, city } = req.body;
  if (!journeyId || !city) return res.status(400).json({ error: 'journeyId and city required' });

  // Fetch the journey to verify ownership
  const { data: journey, error: fetchError } = await supabaseAdmin
    .from('journeys')
    .select('*')
    .eq('id', journeyId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !journey) return res.status(404).json({ error: 'Journey not found' });

  // Publish to public_walks (anonymous — no user_id stored)
  const { error: insertError } = await supabaseAdmin
    .from('public_walks')
    .upsert({
      journey_id: journeyId,
      city: city.trim().toLowerCase(),
      plan: journey.plan,
      citations: journey.citations ?? [],
    }, { onConflict: 'journey_id', ignoreDuplicates: true });

  if (insertError) {
    console.error('[share] insert error:', insertError.message);
    return res.status(500).json({ error: 'Could not share journey' });
  }

  res.json({ ok: true });
}
