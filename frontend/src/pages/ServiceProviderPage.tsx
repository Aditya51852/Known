import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface Request {
  id: string;
  customerName: string;
  distanceKm: number;
  car: string;
  estFare: number; // e.g., 220
}

const mockRequests: Request[] = [
  { id: "R-4501", customerName: "Amit", distanceKm: 3.4, car: "Hyundai i20", estFare: 220 },
  { id: "R-4506", customerName: "Neha", distanceKm: 6.1, car: "Tata Nexon", estFare: 220 },
  { id: "R-4512", customerName: "Raju", distanceKm: 7.9, car: "Maruti Brezza", estFare: 220 },
];

export default function ServiceProviderPage() {
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(8);

  const visible = useMemo(
    () => mockRequests.filter(r => r.distanceKm <= radius),
    [radius]
  );

  const handleLock = (id: string) => setLockedId(id);

  return (
    <div className="min-h-screen bg-[#0B0E12] text-white pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Service Provider Hub</h1>
            <p className="text-gray-400 text-sm">Accept nearby test drive requests. First to lock gets the job; others are disabled.</p>
          </div>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm">← Back to Homepage</Link>
        </div>

        {/* Info strip */}
        <div className="bg-white/5 rounded-xl ring-1 ring-white/10 p-4 mb-6 text-sm text-gray-300">
          <div className="flex flex-wrap items-center gap-4">
            <div>Default test drive fare: <span className="text-white font-medium">₹220</span></div>
            <div>Revenue split: <span className="text-white font-medium">80% to you</span>, <span className="text-white/90">20% to KNOWN</span></div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/5 rounded-xl ring-1 ring-white/10 p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-300">Match radius</label>
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-sm text-gray-300 min-w-[64px] text-right">{radius} km</div>
          </div>
        </div>

        {/* Requests */}
        <div className="grid md:grid-cols-2 gap-4">
          {visible.map(r => {
            const locked = lockedId !== null && lockedId !== r.id;
            const yourLock = lockedId === r.id;
            const providerPayout = Math.round(r.estFare * 0.8);
            const platformPayout = r.estFare - providerPayout;
            return (
              <div key={r.id} className="bg-white/5 rounded-xl ring-1 ring-white/10 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Request {r.id}</div>
                  <div className={`text-xs ${yourLock ? 'text-green-400' : 'text-gray-400'}`}>{yourLock ? 'Locked by you' : `${r.distanceKm} km away`}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
                  <div><span className="text-gray-500">Customer:</span> {r.customerName}</div>
                  <div><span className="text-gray-500">Car:</span> {r.car}</div>
                  <div><span className="text-gray-500">Fare:</span> ₹{r.estFare}</div>
                  <div className="col-span-2 text-xs text-gray-400">Payouts → You: ₹{providerPayout} • KNOWN: ₹{platformPayout}</div>
                </div>
                <button
                  onClick={() => handleLock(r.id)}
                  disabled={locked || yourLock}
                  className={`mt-1 h-10 rounded-full font-medium transition ${yourLock ? 'bg-green-700 text-white' : locked ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600 text-white'}`}
                >
                  {yourLock ? 'Locked - Coordinate with customer' : locked ? 'Locked by another provider' : 'Lock Deal'}
                </button>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="text-center text-gray-400 py-12">No nearby requests within {radius} km.</div>
        )}
      </div>
    </div>
  );
}
