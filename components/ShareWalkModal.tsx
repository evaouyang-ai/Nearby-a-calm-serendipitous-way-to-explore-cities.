// components/ShareWalkModal.tsx
// Appears after "Finish & Keep notes" — asks if user wants to share
// this walk to the public Discover map (anonymous, opt-in).

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ShareWalkModalProps {
  journeyId: string;
  introduction: string;
  onDone: () => void;
}

const ShareWalkModal: React.FC<ShareWalkModalProps> = ({ journeyId, introduction, onDone }) => {
  const [city, setCity] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!city.trim()) return;
    setSharing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ journeyId, city }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Could not share');
      }

      setShared(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 shadow-2xl shadow-slate-300/40 space-y-6">

        {!shared ? (
          <>
            <div className="text-center space-y-2">
              <p className="text-2xl font-serif-italic text-slate-900">Share this walk?</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Add it to the anonymous Discover map so others can find this city through your eyes.
              </p>
            </div>

            {/* Journey preview */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-slate-700 text-sm italic font-medium leading-relaxed">
                "{introduction}"
              </p>
            </div>

            {/* City input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Which city is this?
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Kyoto, Brooklyn, Sunnyvale"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium text-center">{error}</p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                disabled={sharing || !city.trim()}
                className="w-full bg-slate-900 text-white font-bold text-sm py-4 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-40"
              >
                {sharing ? 'Sharing…' : 'Share anonymously'}
              </button>
              <button
                onClick={onDone}
                className="w-full text-[11px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-all py-2"
              >
                Keep it private
              </button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 py-4">
            <p className="text-3xl">🌍</p>
            <div className="space-y-2">
              <p className="text-xl font-serif-italic text-slate-900">Walk shared</p>
              <p className="text-slate-500 text-sm font-medium">
                Someone in {city} might stumble upon your observation.
              </p>
            </div>
            <button
              onClick={onDone}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-all"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareWalkModal;
