
import React, { useState, useEffect, useCallback } from 'react';
import { JourneyPhase, JourneyPlan, JourneyMemory, ItineraryStep } from './types';
import { GeminiService } from './services/geminiService';
import HeroHeader from './components/HeroHeader';
import JourneyInput from './components/JourneyInput';
import ItineraryView from './components/ItineraryView';
import Storyboard from './components/Storyboard';
import Scrapbook from './components/Scrapbook';
import ApiSetup from './components/ApiSetup';

const App: React.FC = () => {
  const [phase, setPhase] = useState<JourneyPhase>(JourneyPhase.SETUP);
  const [plan, setPlan] = useState<JourneyPlan | null>(null);
  const [citations, setCitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [scrapbook, setScrapbook] = useState<JourneyMemory[]>(() => {
    const saved = localStorage.getItem('nearby_memories');
    return saved ? JSON.parse(saved) : [];
  });
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [gemini] = useState(() => new GeminiService());

  useEffect(() => {
    const checkApiKey = async () => {
      // Check if the user has already selected an API key
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          setPhase(JourneyPhase.INPUT);
        } else {
          setPhase(JourneyPhase.SETUP);
        }
      } else {
        // Fallback for environments without the selector
        setPhase(JourneyPhase.INPUT);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    localStorage.setItem('nearby_memories', JSON.stringify(scrapbook));
  }, [scrapbook]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location access declined.", err)
      );
    }
  }, []);

  const saveMemory = useCallback((targetPlan: JourneyPlan, targetCitations: any[]) => {
    const memory: JourneyMemory = {
      id: Math.random().toString(36).substr(2, 9),
      plan: targetPlan,
      citations: targetCitations,
      timestamp: Date.now()
    };
    setScrapbook(prev => {
      if (prev.length > 0 && prev[0].plan.introduction === targetPlan.introduction) return prev;
      return [memory, ...prev].slice(0, 50);
    });
  }, []);

  const handleStartJourney = useCallback(async (prompt: string, area: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { plan: newPlan, citations: newCitations } = await gemini.planJourney(prompt, location, area);
      setPlan(newPlan);
      setCitations(newCitations);
      saveMemory(newPlan, newCitations); 
      setPhase(JourneyPhase.PLANNING);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setErrorMsg(error.message || "Something interrupted the search.");
    } finally {
      setIsLoading(false);
    }
  }, [gemini, location, saveMemory]);

  const handleDrift = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { step, citations: newCitations } = await gemini.drift(location);
      const newPlan = {
        introduction: "You're just drifting. Something caught my eye nearby.",
        steps: [step],
        conclusion: "A nice moment to pause."
      };
      setPlan(newPlan);
      setCitations(newCitations);
      saveMemory(newPlan, newCitations);
      setPhase(JourneyPhase.PLANNING);
    } catch (error: any) {
      setErrorMsg("I couldn't quite see anything right now.");
    } finally {
      setIsLoading(false);
    }
  }, [gemini, location, saveMemory]);

  const handleRefract = useCallback(async (stepIdx: number) => {
    if (!plan) return;
    try {
      const targetStep = plan.steps[stepIdx];
      const { step: refractedStep } = await gemini.refract(targetStep);
      
      const newSteps = [...plan.steps];
      newSteps[stepIdx] = refractedStep;
      
      const updatedPlan = { ...plan, steps: newSteps };
      setPlan(updatedPlan);
    } catch (error) {
      console.error("Refraction failed:", error);
    }
  }, [gemini, plan]);

  const handleOpenSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setErrorMsg(null);
      setPhase(JourneyPhase.INPUT);
    }
  };

  const isApiKeyError = errorMsg?.toLowerCase().includes("api key") || errorMsg?.toLowerCase().includes("invalid");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-200">
      <HeroHeader 
        onToggleScrapbook={() => setIsScrapbookOpen(true)} 
        scrapbookCount={scrapbook.length}
      />
      
      <Scrapbook 
        memories={scrapbook} 
        isOpen={isScrapbookOpen} 
        onClose={() => setIsScrapbookOpen(false)} 
        onRevisit={(memory) => {
          setPlan(memory.plan);
          setCitations(memory.citations);
          setPhase(JourneyPhase.PLANNING);
          setIsScrapbookOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-grow pb-24">
        {phase === JourneyPhase.SETUP && (
          <ApiSetup onComplete={() => setPhase(JourneyPhase.INPUT)} />
        )}

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
                    <p className="font-bold mb-2 text-slate-900 uppercase tracking-widest text-[11px]">A quiet interruption</p>
                    <p className="leading-relaxed font-medium mb-4">{errorMsg}</p>
                    
                    {isApiKeyError && (
                      <button 
                        onClick={handleOpenSelectKey}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-2 transition-all"
                      >
                        <i className="fa-solid fa-key"></i>
                        Update API Key
                      </button>
                    )}
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

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
