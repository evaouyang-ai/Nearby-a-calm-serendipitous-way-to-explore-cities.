// components/AuthModal.tsx
// Minimal sign-in modal (Google + Email magic link).
// Replaces the old ApiSetup component.

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] max-w-sm w-full p-10 shadow-2xl shadow-slate-300/40 text-center space-y-8">
        <div>
          <h2 className="text-2xl font-serif-italic text-slate-900 mb-2">Save your walks</h2>
          <p className="text-slate-500 text-sm font-medium">
            Sign in to keep your Scrapbook across devices.
          </p>
        </div>

        {!sent ? (
          <>
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold text-sm py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-4 rounded-2xl transition-all disabled:opacity-40"
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-xs font-medium">{error}</p>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">✉️</div>
            <p className="text-slate-700 font-medium text-sm">
              Check your inbox — we sent a sign-in link to <strong>{email}</strong>.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-all"
        >
          Continue without saving
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
