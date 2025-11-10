import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface CarPref {
  brand: string;
  model: string;
  variant?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  locationPin?: string;
}

const BargeinSelectCar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pref, setPref] = useState<CarPref>({ brand: '', model: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false;
    if (!isAuthenticated) {
      navigate('/auth?from=' + encodeURIComponent('/bargein/select-car'));
    }
    // Prefill from query params
    const qpBrand = searchParams.get('brand') || '';
    const qpModel = searchParams.get('model') || '';
    if (qpBrand || qpModel) setPref((p) => ({ ...p, brand: qpBrand || p.brand, model: qpModel || p.model }));
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pref.brand || !pref.model) return;
    // Enforce token rule: token valid 7 days, usable for up to 2 different brands
    try {
      const raw = localStorage.getItem('bargein.currentToken');
      if (!raw) {
        setError('No active token found. Please generate a token first.');
        navigate('/bargein/consent');
        return;
      }
      const token = JSON.parse(raw);
      const now = new Date();
      const exp = new Date(token.expiresAt);
      if (now > exp) {
        setError('Your token has expired. Please generate a new token.');
        navigate('/bargein/consent');
        return;
      }
      const usedBrands: string[] = Array.isArray(token.usedBrands) ? token.usedBrands : [];
      const uniqueCount = new Set(usedBrands).size;
      const brandNormalized = (pref.brand || '').trim();
      if (!usedBrands.includes(brandNormalized) && uniqueCount >= 2) {
        setError('This token has already been used for two different brands this week. Please generate a new token.');
        return;
      }
      // Update token with this brand (if not already recorded)
      if (!usedBrands.includes(brandNormalized)) {
        token.usedBrands = [...usedBrands, brandNormalized];
        localStorage.setItem('bargein.currentToken', JSON.stringify(token));
      }
    } catch {}

    // TODO: Persist arena preferences and create arena ID from backend.
    const fakeArenaId = 'demo-arena-1';
    navigate(`/bargein/arena/${fakeArenaId}`);
  };

  const favourites = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('favourites') || '[]'); } catch { return []; }
  }, []);

  return (
    <div className="min-h-screen bg-[#0C1117] pt-24 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6">
          {/* Left: Form */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-white mb-1">Select Car for Bargein</h1>
            <p className="text-white/60 text-sm mb-4">Your token can be used for up to two different brands within 7 days.</p>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Brand</label>
            <input
              value={pref.brand}
              onChange={(e) => setPref({ ...pref, brand: e.target.value })}
              className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
              placeholder="e.g., Toyota"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Model</label>
            <input
              value={pref.model}
              onChange={(e) => setPref({ ...pref, model: e.target.value })}
              className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
              placeholder="e.g., Fortuner"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Fuel Type</label>
              <select
                value={pref.fuelType || ''}
                onChange={(e) => setPref({ ...pref, fuelType: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
              >
                <option value="">Any</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Transmission</label>
              <select
                value={pref.transmission || ''}
                onChange={(e) => setPref({ ...pref, transmission: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
              >
                <option value="">Any</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Price Min</label>
              <input type="number" min={0}
                value={pref.priceMin || ''}
                onChange={(e) => setPref({ ...pref, priceMin: Number(e.target.value) })}
                className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
                placeholder="e.g., 2000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Price Max</label>
              <input type="number" min={0}
                value={pref.priceMax || ''}
                onChange={(e) => setPref({ ...pref, priceMax: Number(e.target.value) })}
                className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
                placeholder="e.g., 3500000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Preferred Color</label>
            <input
              value={pref.color || ''}
              onChange={(e) => setPref({ ...pref, color: e.target.value })}
              className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
              placeholder="e.g., White"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">PIN Code (for dealer radius)</label>
            <input
              value={pref.locationPin || ''}
              onChange={(e) => setPref({ ...pref, locationPin: e.target.value })}
              className="w-full rounded-lg px-3 py-2 bg-black/20 border border-white/10 text-white"
              placeholder="e.g., 560001"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => navigate('/bargein/consent')} className="text-white/80 hover:text-white">Back</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-500">Create Arena</button>
          </div>
            </form>
          </div>

          {/* Right: Favourites and Search */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Choose from Favourites</h2>
                <span className="text-xs text-white/50">Saved on car pages</span>
              </div>
              {favourites.length === 0 ? (
                <div className="text-sm text-white/60">No favourites yet. Open a car page and tap the heart to add.</div>
              ) : (
                <div className="space-y-2">
                  {favourites.map((f: any) => (
                    <button
                      key={f.id}
                      onClick={() => setPref((p) => ({ ...p, brand: f.brand || p.brand, model: f.name || p.model }))}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90"
                    >
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-white/60">{f.brand}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-2">Search for a Car</h2>
              <p className="text-white/60 text-sm mb-3">Go to homepage to search and open a car page. Each car page has “Enter Bargein Arena”.</p>
              <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">Go to Homepage</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargeinSelectCar;
