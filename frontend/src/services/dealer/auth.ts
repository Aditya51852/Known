const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const buildHeaders = (): HeadersInit => ({ 'Content-Type': 'application/json' });

export const dealerAuthApi = {
  register: async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/dealer/register`, {
      method: 'POST', headers: buildHeaders(), body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error?.message || 'Dealer registration failed');
    return data as { token: string; refreshToken: string; dealer: any };
  },
  login: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/dealer/login`, {
      method: 'POST', headers: buildHeaders(), body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { const err: any = new Error(data.message || 'Dealer login failed'); err.code = data.error || data.code; throw err; }
    return data as { token: string; refreshToken: string; dealer: any };
  },
  refresh: async (refreshToken: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/dealer/refresh`, {
      method: 'POST', headers: buildHeaders(), body: JSON.stringify({ refreshToken })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to refresh token');
    return data as { token: string; refreshToken: string; dealer: any };
  },
  logout: async (refreshToken?: string) => {
    try { await fetch(`${API_BASE_URL}/auth/dealer/logout`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ refreshToken }) }); } catch {}
  }
};

export default dealerAuthApi;
