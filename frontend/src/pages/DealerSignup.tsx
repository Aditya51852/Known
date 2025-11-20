import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { dealerAuthApi } from '../services/api';

export default function DealerSignup() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pre = sp.get('email');
    if (pre) setEmail(pre);
  }, [sp]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await dealerAuthApi.register({ name, email, password, phone: phone || undefined });
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('dealerRefreshToken', res.refreshToken);
      localStorage.setItem('dealer', JSON.stringify(res.dealer));
      navigate('/dealer/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-6">Dealer Signup</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} required className="w-full h-11 rounded border px-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full h-11 rounded border px-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full h-11 rounded border px-3" />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone (optional)</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full h-11 rounded border px-3" />
          </div>
          <button disabled={loading} className="w-full h-11 rounded bg-gray-900 text-white font-medium">{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <div className="mt-4 text-sm text-gray-600">Already have an account? <Link to="/dealer/login" className="underline">Login</Link></div>
      </div>
    </div>
  );
}
