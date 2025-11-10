import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BargeinLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to auth, with return path
      navigate(`/auth?from=${encodeURIComponent(location.pathname)}`);
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0C1117] pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs mb-6">
            <span>⚡</span> <span>Revolutionary Car Buying Experience</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Step into the <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Bargein Arena</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70">Negotiate the Best Deal</p>
          <p className="mt-1 text-white/60">Where Dealers Compete for Your Business</p>

          <div className="mt-8">
            <Link
              to="/bargein/consent"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-600/20"
            >
              Enter Bargein Arena
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[
              { label: 'Successful Deals', value: '50K+' },
              { label: 'Verified Dealers', value: '2,000+' },
              { label: 'Money Saved', value: '₹12Cr+' },
              { label: 'User Rating', value: '4.9★' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-white text-2xl font-extrabold">{s.value}</div>
                <div className="text-white/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-white">
            How the <span className="text-cyan-400">Arena</span> Works
          </h2>
          <p className="text-center text-white/60 mt-2">A revolutionary approach to car buying that puts you in control</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Enter Arena', desc: 'Sign up and agree to our fair trading terms', icon: '🛡️' },
              { step: '02', title: 'Choose Car', desc: 'Select your preferred car model and specifications', icon: '🚗' },
              { step: '03', title: 'Anonymous Bidding', desc: 'Dealers compete with offers using your masked identity', icon: '👤' },
              { step: '04', title: 'Best Deal', desc: 'Select the winning bid and complete your purchase', icon: '📈' },
            ].map((c) => (
              <div key={c.step} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-xl">{c.icon}</div>
                  <div className="text-white/10 text-3xl font-extrabold">{c.step}</div>
                </div>
                <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                <p className="text-white/60 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-white">Why Choose <span className="text-cyan-400">Bargein Arena</span></h2>
          <p className="text-center text-white/60 mt-2">Experience the future of car buying with our innovative platform</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Anonymous Bidding', desc: 'Your identity stays protected until you choose to reveal it', icon: '🛡️' },
              { title: 'Multiple Dealers', desc: 'Get competing offers from verified dealers in your area', icon: '👥' },
              { title: 'Fair Negotiation', desc: 'Transparent bidding process with clear terms and conditions', icon: '⚖️' },
              { title: 'Real-time Bidding', desc: 'Live negotiation with instant updates and notifications', icon: '⚡' },
            ].map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-xl">{b.icon}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{b.title}</h3>
                  <p className="text-white/60 text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-6 py-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-white">Success <span className="text-cyan-400">Stories</span></h2>
          <p className="text-center text-white/60 mt-2">Real customers, real savings, real satisfaction</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Rajesh Kumar', city: 'Mumbai', car: 'BMW 3 Series', quote: 'Saved ₹2.5L on my BMW through competitive bidding. Amazing experience!' },
              { name: 'Priya Sharma', city: 'Delhi', car: 'Audi Q5', quote: 'The anonymous feature gave me confidence to negotiate better deals.' },
              { name: 'Vikram Singh', city: 'Bangalore', car: 'Mercedes C-Class', quote: 'Multiple dealers competing for my business - got the best price possible.' },
            ].map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-yellow-400 mb-3">★★★★★</div>
                <p className="text-white/80 italic mb-4">"{t.quote}"</p>
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-white/60 text-sm">{t.city} • {t.car}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/bargein/consent"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
            >
              Enter Bargein Arena
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BargeinLanding;
