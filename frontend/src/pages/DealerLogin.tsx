import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dealerAuthApi from '../services/dealer/auth';

export default function DealerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-6">Dealer Login</h1>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error} {error?.includes('Create one') && (
            <Link to={`/dealer/signup?email=${encodeURIComponent(email)}`} className="underline ml-1">Create account</Link>
          )}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-11 rounded border px-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-11 rounded border px-3" />
          </div>
          <button disabled={loading} className="w-full h-11 rounded bg-gray-900 text-white font-medium">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-4 text-sm text-gray-600">Don't have an account? <Link to="/dealer/signup" className="underline">Sign up</Link></div>
      </div>
    </div>
  );
}
