import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const BargeinTokenSuccess: React.FC = () => {
  const { tokenId } = useParams();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);

  useEffect(() => {
    if (!tokenId) return;
    try {
      const now = new Date();
      const token = {
        tokenId,
        createdAt: now.toISOString(),
        expiresAt: validUntil.toISOString(),
        usedBrands: [] as string[],
      };
      localStorage.setItem('bargein.currentToken', JSON.stringify(token));
    } catch {}
  }, [tokenId]);

  return (
    <div className="min-h-screen bg-[#0C1117] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Token Generated Successfully!</h1>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-white/60 text-sm">Your Token ID</div>
                <div className="text-cyan-300 font-mono text-xl font-bold">{tokenId}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Valid Until</div>
                <div className="text-white font-semibold">{validUntil.toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Status</div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-sm font-semibold">Active</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center">🛡️</div>
                <div>
                  <div className="font-semibold text-white">Anonymous Identity</div>
                  <div className="text-sm text-white/70">Your personal details are masked until deal closure</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center">👥</div>
                <div>
                  <div className="font-semibold text-white">Dealer Matching</div>
                  <div className="text-sm text-white/70">Verified dealers within 50–60 km will be notified</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center">⏱️</div>
                <div>
                  <div className="font-semibold text-white">7 Days Validity</div>
                  <div className="text-sm text-white/70">Complete your negotiation within the validity period</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/bargein/select-car"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Select Your Car
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargeinTokenSuccess;
