import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Banner() {
  const navigate = useNavigate();
  const candidates = useMemo(
    () => [
      // Showroom / negotiation vibes that fit "Bargain Arena"
      'https://images.unsplash.com/photo-1549921296-3cbebd57a1fb?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=1600&h=900&fit=crop',
    ],
    []
  );
  const [imgIndex, setImgIndex] = useState(0);

  const handleError = () => {
    setImgIndex((prev) => (prev + 1) % candidates.length);
  };

  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden group">
      {/* Full-bleed background image with fallback rotation */}
      <img
        key={imgIndex}
        src={candidates[imgIndex]}
        alt="Bargain Arena hero"
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleError}
      />
      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
      <div className="relative z-30 h-full flex items-center justify-center text-center text-white px-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 md:mb-5">
            Enter the Bargain Arena
          </h1>
          <p className="text-base md:text-xl mb-6 opacity-95">
            Our signature feature: dealers compete, you save. Start your journey.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate('/bargein')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-600/20"
            >
              Enter Bargain Arena
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Click anywhere background doesn't navigate; CTA button handles routing */}
    </div>
  );
}