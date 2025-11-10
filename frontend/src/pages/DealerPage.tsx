import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface ArenaToken {
  id: string;
  customerDistrict: string;
  distanceKm: number;
  budget: string;
  carInterest: string[];
  expiresInMin: number;
}

const mockTokens: ArenaToken[] = [
  { id: "T-9821", customerDistrict: "Thane", distanceKm: 12, budget: "₹10–12L", carInterest: ["Hyundai i20", "Tata Altroz"], expiresInMin: 14 },
  { id: "T-9827", customerDistrict: "Mumbai", distanceKm: 22, budget: "₹8–9L", carInterest: ["Baleno"], expiresInMin: 28 },
  { id: "T-9833", customerDistrict: "Navi Mumbai", distanceKm: 44, budget: "₹18–22L", carInterest: ["Seltos", "Creta"], expiresInMin: 7 },
];

export default function DealerPage() {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [radius, setRadius] = useState<number>(50);

  const filtered = useMemo(
    () => mockTokens.filter(t => t.distanceKm <= radius),
    [radius]
  );

  const handleJoin = (id: string) => setJoined(prev => ({ ...prev, [id]: true }));

  return (
    <div className="min-h-screen bg-[#0B0E12] text-white pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dealer Arena</h1>
            <p className="text-gray-400 text-sm">Get notified when buyers within your radius raise a bargain token.</p>
          </div>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm">← Back to Homepage</Link>
        </div>

        {/* Controls */}
        <div className="bg-white/5 rounded-xl ring-1 ring-white/10 p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-300">Search radius</label>
            <input
              type="range"
              min={10}
              max={70}
              step={5}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-sm text-gray-300 min-w-[64px] text-right">{radius} km</div>
          </div>
        </div>

        {/* Tokens list */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white/5 rounded-xl ring-1 ring-white/10 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Token {t.id}</div>
                <div className="text-xs text-gray-400">Expires in {t.expiresInMin}m</div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
                <div><span className="text-gray-500">District:</span> {t.customerDistrict}</div>
                <div><span className="text-gray-500">Distance:</span> {t.distanceKm} km</div>
                <div><span className="text-gray-500">Budget:</span> {t.budget}</div>
                <div className="col-span-2"><span className="text-gray-500">Interested cars:</span> {t.carInterest.join(", ")}</div>
              </div>
              <button
                onClick={() => handleJoin(t.id)}
                disabled={!!joined[t.id]}
                className={`mt-1 h-10 rounded-full font-medium transition ${joined[t.id] ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600 text-white'}`}
              >
                {joined[t.id] ? 'Joined Arena' : 'Join Arena'}
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-12">No tokens within {radius} km right now. Increase radius or check back later.</div>
        )}
      </div>
    </div>
  );
}
