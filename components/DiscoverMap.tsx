// components/DiscoverMap.tsx
// Public discover page — shows anonymous walks from all users, filtered by city.
// Route: /discover

import React, { useState, useEffect } from 'react';

interface PublicWalk {
  id: string;
  city: string;
  plan: {
    introduction: string;
    steps: Array<{
      title: string;
      destination: { name: string; location: string; sensoryDetail: string };
    }>;
    conclusion: string;
  };
  created_at: string;
}

const DiscoverMap: React.FC = () => {
  const [walks, setWalks] = useState<PublicWalk[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchWalks();
  }, [city]);

  const fetchWalks = async () => {
    setLoading(true);
    try {
      const url = city
        ? `/api/discover?city=${encodeURIComponent(city)}&limit=20`
        : '/api/discover?limit=20';
      const res = await fetch(url);
      const data = await res.json();
      setWalks(data.walks ?? []);

      // Extract unique cities for filter pills
      if (!city) {
        const unique = [...new Set((data.walks ?? []).map((w: PublicWalk) => w.city))].slice(0, 10);
        setCities(unique as string[]);
      }
    } catch (err) {
      console.error('[discover] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-8 text-center space-y-4">
        <h1 className="text-4xl font-serif-italic text-slate-900">Discover</h1>
        <p className="text-slate-500 text-sm font-medium italic">
          Quiet observations, shared anonymously from cities around the world.
        </p>
      </div>

      {/* City filter */}
      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setCity('')}
            className={`text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-all border ${
              !city
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}
          >
            All cities
          </button>
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-all border ${
                city === c
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Custom city search */}
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value.toLowerCase())}
            placeholder="Search a city..."
            className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all w-64"
          />
        </div>
      </div>

      {/* Walks */}
      <div className="max-w-2xl mx-auto px-6 pb-24 space-y-8">
        {loading ? (
          <div className="text-center py-24">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : walks.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-slate-400 font-serif-italic text-xl">
              {city ? `No walks in ${city} yet.` : 'No shared walks yet.'}
            </p>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
              Be the first to share one
            </p>
          </div>
        ) : (
          walks.map(walk => (
            <div
              key={walk.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              {/* City + date */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  {walk.city}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(walk.created_at).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>

              {/* Introduction */}
              <p className="text-xl font-serif-italic text-slate-900 leading-relaxed italic mb-6">
                "{walk.plan.introduction}"
              </p>

              {/* Steps preview */}
              <div className="space-y-3">
                {walk.plan.steps.slice(0, 2).map((step, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      {step.destination.location}
                    </p>
                    <p className="text-slate-700 text-sm italic font-medium">
                      "{step.destination.sensoryDetail}"
                    </p>
                  </div>
                ))}
                {walk.plan.steps.length > 2 && (
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest px-1">
                    + {walk.plan.steps.length - 2} more moments
                  </p>
                )}
              </div>

              {/* Conclusion */}
              <p className="text-sm text-slate-500 italic font-medium mt-6 pt-6 border-t border-slate-100">
                "{walk.plan.conclusion}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscoverMap;
