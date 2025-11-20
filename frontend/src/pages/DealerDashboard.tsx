import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dealerApi, dealerAuthApi } from '../services/api';

interface Dealer { id: string; name: string; email: string; }

export default function DealerDashboard() {
  const navigate = useNavigate();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dStr = localStorage.getItem('dealer');
    const token = localStorage.getItem('authToken');
    if (!dStr || !token) { navigate('/dealer/login'); return; }
    const d = JSON.parse(dStr);
    setDealer(d);
    (async () => {
      try {
        const inv = await dealerApi.inventory.list(d.id, { limit: 10 });
        setInventory(inv);
        const b = await dealerApi.bookings.list(d.id, { limit: 10 });
        setBookings(b);
      } catch (e: any) { setError(e?.message || 'Failed to load'); }
    })();
  }, [navigate]);

  const logout = async () => {
    try {
      const rt = localStorage.getItem('dealerRefreshToken') || undefined;
      await dealerAuthApi.logout(rt);
    } catch {}
    localStorage.removeItem('authToken');
    localStorage.removeItem('dealerRefreshToken');
    localStorage.removeItem('dealer');
    navigate('/dealer/login');
  };

  if (!dealer) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {dealer.name}</h1>
            <p className="text-gray-600 text-sm">Dealer Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/dealer/profile`} className="text-sm underline">Edit Profile</Link>
            <button onClick={logout} className="h-9 px-3 rounded bg-gray-900 text-white text-sm">Logout</button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Inventory</h2>
              <Link to="#" className="text-sm underline">Add Item</Link>
            </div>
            <div className="divide-y">
              {inventory.map((it) => (
                <div key={it._id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-gray-600">{it.status} • ₹{it.price}</div>
                  </div>
                  <Link to="#" className="text-sm text-gray-700 underline">Edit</Link>
                </div>
              ))}
              {inventory.length === 0 && <div className="text-sm text-gray-500">No items yet</div>}
            </div>
          </div>

          <div className="bg-white shadow rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Recent Bookings</h2>
            </div>
            <div className="divide-y">
              {bookings.map((b) => (
                <div key={b._id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{b.status.toUpperCase()}</div>
                    <div className="text-xs text-gray-600">₹{b.priceQuoted || '-'}</div>
                  </div>
                  <div className="text-xs text-gray-600">{new Date(b.startDate).toLocaleString()} - {new Date(b.endDate).toLocaleString()}</div>
                </div>
              ))}
              {bookings.length === 0 && <div className="text-sm text-gray-500">No bookings yet</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
