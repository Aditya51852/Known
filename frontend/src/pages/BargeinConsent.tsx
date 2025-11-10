import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BargeinConsent: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false;
    if (!isAuthenticated) {
      navigate('/auth?from=' + encodeURIComponent('/bargein/consent'));
    }
  }, [navigate]);

  const handleProceed = () => {
    if (!agreed) return;
    // TODO: Integrate payment. For now, simulate payment success and token generation.
    const fakeTokenId = 'TK-2025-001';
    navigate(`/bargein/token-success/${fakeTokenId}`);
  };

  return (
    <div className="min-h-screen bg-[#0C1117] pt-24 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 px-6">
        {/* Terms & Conditions */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center">📄</div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Bargein Arena Agreement</h1>
          </div>
          <p className="text-white/70 mb-6">Please read and accept our terms and conditions to enter the arena</p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-white/80 text-sm leading-6">
            <h2 className="font-semibold text-white mb-3">1. Platform Overview</h2>
            <p className="mb-4">The Bargein Arena is an innovative car negotiation platform where buyers can receive competitive offers from multiple verified dealers while maintaining anonymity until deal closure.</p>

            <h2 className="font-semibold text-white mb-2">2. Anonymous Bidding System</h2>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Your identity remains completely anonymous during the bidding process</li>
              <li>Dealers see only your car preferences and token ID</li>
              <li>Personal details are revealed only after you select a dealer and confirm the deal</li>
              <li>All communications during bidding happen through our secure platform</li>
            </ul>

            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <div className="font-semibold mb-1">Important Notice</div>
              <p className="text-sm">The token fee is non-refundable once the bidding process begins. Please ensure you are ready to proceed with the purchase before generating your token.</p>
            </div>
          </div>

          <label className="flex items-start gap-3 mt-6">
            <input type="checkbox" className="mt-1" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span className="text-white/80">
              I have read, understood, and agree to the Terms & Conditions of the Bargein Arena. I acknowledge that the token
              fee is non-refundable and I am ready to proceed with the car buying process.
            </span>
          </label>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => navigate('/bargein')} className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10">Go Back</button>
            <button
              disabled={!agreed}
              onClick={handleProceed}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white ${agreed ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-white/10 cursor-not-allowed'}`}
            >
              <span>Proceed to Payment</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </div>

        {/* Token Purchase Card */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center">💳</div>
              <h2 className="text-white font-bold">Token Purchase</h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center mb-4">
              <div className="text-3xl font-extrabold text-white">₹199</div>
              <div className="text-white/60">Arena Entry Token</div>
            </div>

            <div className="space-y-2 text-white/80 text-sm">
              <div className="flex items-center justify-between"><span>Token Fee</span><span>₹199</span></div>
              <div className="flex items-center justify-between"><span>Platform Fee</span><span>₹0</span></div>
              <div className="flex items-center justify-between"><span>GST (18%)</span><span>₹36</span></div>
              <hr className="border-white/10 my-2" />
              <div className="flex items-center justify-between font-semibold text-white"><span>Total</span><span>₹235</span></div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✔ 7 days validity period</li>
              <li>✔ Anonymous bidding protection</li>
              <li>✔ Multi-dealer competitive offers</li>
            </ul>

            <button
              onClick={handleProceed}
              disabled={!agreed}
              className={`w-full mt-6 px-5 py-2.5 rounded-lg font-semibold text-white ${agreed ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400' : 'bg-white/10 cursor-not-allowed'}`}
            >
              🔒 Secure Payment
            </button>
            <div className="text-center text-xs text-white/50 mt-2">Powered by secure payment gateway. Your data is protected.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargeinConsent;
