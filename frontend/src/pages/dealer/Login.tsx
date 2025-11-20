import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dealerAuthApi from '../../services/dealer/auth';

export default function DealerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const images = [
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
  ];
  const heroImage = useMemo(() => images[Math.floor(Math.random() * images.length)], []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await dealerAuthApi.login({ email, password });
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('dealerRefreshToken', res.refreshToken);
      localStorage.setItem('dealer', JSON.stringify(res.dealer));
      navigate('/dealer/dashboard');
    } catch (e: any) {
      const code = e?.code;
      if (code === 'USER_NOT_FOUND') {
        setError('No account found. Create one?');
      } else if (code === 'INVALID_CREDENTIALS') {
        setError('Password incorrect');
      } else {
        setError(e?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column (Hero) */}
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl sm:text-5xl font-semibold">Dealer Portal</h1>
            <div className="relative w-80 h-64 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img src={heroImage} alt="Dealer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <p className="text-gray-300 text-lg">Manage inventory and bookings with ease</p>
          </div>

          {/* Right Column (Dealer Email/Password) */}
          <div className="bg-gray-900/50 rounded-2xl p-8 ring-1 ring-white/10 max-w-md w-full mx-auto">
            <Link to="/auth" className="inline-flex items-center text-gray-300 hover:text-white text-sm mb-4">
              <span className="mr-2">←</span> Back
            </Link>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Dealer Login</h2>
              <p className="text-gray-400">Login with your email and password</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error} {error?.includes('Create one') && (
                  <Link to={`/dealer/signup?email=${encodeURIComponent(email)}`} className="underline ml-1 text-red-200">Create account</Link>
                )}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg bg-gray-800 border border-white/10 px-3 text-white placeholder-gray-400 outline-none"
                  placeholder="you@dealers.com"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg bg-gray-800 border border-white/10 px-3 text-white placeholder-gray-400 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                disabled={loading}
                className="w-full h-12 rounded-full font-medium bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white transition-transform active:scale-[0.99]"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/dealer/signup" className="underline text-white">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
