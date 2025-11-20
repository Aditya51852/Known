const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const buildHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) (headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const clientAuthApi = {
  googleSignIn: async (payload: { idToken?: string; email?: string; googleId?: string; name?: string; role?: 'client' | 'dealer' | 'service_provider' | 'mentor' }) => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST', headers: buildHeaders(), body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || 'Google sign-in failed');
    return data;
  },
  sendOtp: async (phone: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/send`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ phone }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || 'Failed to send OTP');
    return data;
  },
  verifyOtp: async (phone: string, otp: string, role?: 'client' | 'dealer' | 'service_provider' | 'mentor') => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify({ phone, otp, role }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || 'Invalid OTP');
    return data;
  },
  register: async (userData: { name: string; email?: string; phone?: string; password: string; role?: 'client' | 'dealer' | 'service_provider'; }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(userData) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || 'Registration failed');
    return data;
  },
  login: async (credentials: { email?: string; phone?: string; password: string; }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(credentials) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || 'Login failed');
    return data;
  },
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { headers: buildHeaders(true) });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
  updateProfile: async (userData: { name?: string; email?: string; phone?: string; }) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { method: 'PATCH', headers: buildHeaders(true), body: JSON.stringify(userData) });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },
};

export default clientAuthApi;
