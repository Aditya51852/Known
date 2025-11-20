const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const buildHeaders = (includeAuth = false): HeadersInit => {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const t = localStorage.getItem('authToken');
    if (t) (h as any)['Authorization'] = `Bearer ${t}`;
  }
  return h;
};

export const dealerApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const usp = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
    const res = await fetch(`${API_BASE_URL}/dealers${usp.toString() ? `?${usp.toString()}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch dealers');
    return res.json();
  },
  get: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/dealers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch dealer');
    return res.json();
  },
  update: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/dealers/${id}`, { method: 'PUT', headers: buildHeaders(true), body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed to update dealer');
    return res.json();
  },
  inventory: {
    list: async (dealerId: string, params?: { page?: number; limit?: number; status?: string }) => {
      const usp = new URLSearchParams();
      if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory${usp.toString() ? `?${usp.toString()}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch inventory');
      return res.json();
    },
    create: async (dealerId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory`, { method: 'POST', headers: buildHeaders(true), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create inventory');
      return res.json();
    },
    get: async (dealerId: string, invId: string) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory/${invId}`);
      if (!res.ok) throw new Error('Failed to fetch inventory item');
      return res.json();
    },
    update: async (dealerId: string, invId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory/${invId}`, { method: 'PUT', headers: buildHeaders(true), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to update inventory');
      return res.json();
    },
    remove: async (dealerId: string, invId: string) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory/${invId}`, { method: 'DELETE', headers: buildHeaders(true) });
      if (!res.ok) throw new Error('Failed to delete inventory');
      return res.json();
    },
  },
  bookings: {
    list: async (dealerId: string, params?: { page?: number; limit?: number; status?: string }) => {
      const usp = new URLSearchParams();
      if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings${usp.toString() ? `?${usp.toString()}` : ''}`, { headers: buildHeaders(true) });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
    create: async (dealerId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings`, { method: 'POST', headers: buildHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create booking');
      return res.json();
    },
    update: async (dealerId: string, bookingId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings/${bookingId}`, { method: 'PUT', headers: buildHeaders(true), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to update booking');
      return res.json();
    },
    get: async (dealerId: string, bookingId: string) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings/${bookingId}`, { headers: buildHeaders(true) });
      if (!res.ok) throw new Error('Failed to fetch booking');
      return res.json();
    },
  }
};

export default dealerApi;
