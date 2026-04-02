// App.tsx — Production version of Nearby
// Changes from prototype:
//   1. Uses ApiClient instead of GeminiService (API key hidden server-side)
//   2. Supabase auth + cloud Scrapbook (falls back to localStorage if signed out)
//   3. Removed window.aistudio dependency
//   4. Added AuthModal for sign-in

import React, { useState, useEffect, useCallback } from 'react';
import { JourneyPhase, JourneyPlan, JourneyMemory, ItineraryStep } from './types';
import { ApiClient } from './services/apiClient';
import { loadMemories, saveMemory, migrateLocalToCloud } from './lib/scrapbookStore';
import { supabase } from './lib/supabase';
import HeroHeader from './components/HeroHeader';
import JourneyInput from './components/JourneyInput';
import ItineraryView from './components/ItineraryView';
import Storyboard from './components/Storyboard';
import Scrapbook from './components/Scrapbook';
import AuthModal from './components/AuthModal';
import type { User } from '@supabase/supabase-js';

const client = new ApiClient();

const App: React.FC = () => {
  const [phase, setPhase] = useState<JourneyPhase>(JourneyPhase.INPUT);
  const [plan, setPlan] = useState<JourneyPlan | null>(null);
  const [citations, setCitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [scrapbook, setScrapbook] = useState<JourneyMemory[]>([]);
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ── Auth ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Migrate any memories saved locally before login
        await migrateLocalToCloud();
        const memories = await loadMemories();
        setScrapbook(memories);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Load scrapbook ────────────────────────────────────────────────────────

  useEffect(() => {
    loadMemories().then(setScrapbook);
  }, []);

  // ── GPS ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.warn('Location access declined.', err)
      );
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const persistMemory = useCallback(async (targetPlan: JourneyPlan, targetCitations: any[]) => {
    const memory: JourneyMemory = {
      id: Math.random().toString(36).substr(2, 9),
      plan: targetPlan,
      citations: targetCitations,
      timestamp: Date.now(),
    };
    await saveMemory(memory);
    setScrapbook(prev => {
      if (prev.length > 0 && prev[0].plan.introduction === targetPlan.introduction) return prev;
      return [memory, ...prev].slice(0, 50);
    });
  }, []);

  // ── Journey actions ───────────────────────────────────────────────────────

  const handleStartJourney = useCallback(async (prompt: string, area: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { plan: newPlan, citations: newCitations } = await client.planJourney(prompt, location, area);
      setPlan(newPlan);
      setCitations(newCitations);
      await persistMemory(newPlan, newCitations);
      setPhase(JourneyPhase.PLANNING);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setErrorMsg(error.message || 'Something interrupted the search.');
    } finally {
      setIsLoading(false);
    }
  }, [location, persistMemory]);

  const handleDrift = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { step, citations: newCitations } = await client.drift(location);
      const newPlan: JourneyPlan = {
        introduction: "You're just drifting. Something caught my eye nearby.",
        steps: [step],
        conclusion: 'A nice moment to pause.',
      };
      setPlan(newPlan);
      setCitations(newCitations);
      await persistMemory(newPlan, newCitations);
      setPhase(JourneyPhase.PLANNING);
    } catch (error: any) {
      setErrorMsg("I couldn't quite see anything right now.");
    } finally {
      setIsLoading(false);
    }
  }, [location, persistMemory]);

  const handleRefract = useCallback(async (stepIdx: number) => {
    if (!plan) return;
    try {
      const { step: refractedStep } = await client.refract(plan.steps[stepIdx]);
      const newSteps = [...plan.steps];
      newSteps[stepIdx] = refractedStep;
      setPlan({ ...plan, steps: newSteps });
    } catch (error) {
      console.error('Refraction failed:', error);
    }
  }, [plan]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-200">
      <HeroHeader
        onToggleScrapbook={() => setIsScrapbookOpen(true)}
        scrapbookCount={scrapbook.length}
        user={user}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={() => supabase.auth.signOut()}
      />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <Scrapbook
        memories={scrapbook}
        isOpen={isScrapbookOpen}
        onClose={() => setIsScrapbookOpen(false)}
        onRevisit={memory => {
          setPlan(memory.plan);
          setCitations(memory.citations);
          setPhase(JourneyPhase.PLANNING);
          setIsScrapbookOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-grow pb-24">
        {phase === JourneyPhase.INPUT && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <JourneyInput
              onStart={handleStartJourney}
              onDrift={handleDrift}
              onOpenJournal={() => setIsScrapbookOpen(true)}
              isLoading={isLoading}
              hasHistory={scrapbook.length > 0}
            />

            {errorMsg && (
              <div className="max-w-xl mx-auto px-6 mt-8">
                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] text-slate-600 text-sm flex gap-6 items-start shadow-xl shadow-slate-200/50">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-circle-info text-slate-400"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold mb-2 text-slate-900 uppercase tracking-widest text-[11px]">
                      A quiet interruption
                    </p>
                    <p className="leading-relaxed font-medium">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === JourneyPhase.PLANNING && plan && (
          <ItineraryView
            plan={plan}
            citations={citations}
            onComplete={() => setPhase(JourneyPhase.STORYBOARD)}
            onReset={() => setPhase(JourneyPhase.INPUT)}
            onRefract={handleRefract}
          />
        )}

        {phase === JourneyPhase.STORYBOARD && plan && (
          <Storyboard
            plan={plan}
            onReset={() => setPhase(JourneyPhase.INPUT)}
            onViewJournal={() => setIsScrapbookOpen(true)}
          />
        )}
      </main>

      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
