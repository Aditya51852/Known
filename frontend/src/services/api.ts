const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Dealer Auth API
export const dealerAuthApi = {
  register: async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/dealer/register`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || data.error?.message || 'Dealer registration failed');
    }
    return data as { token: string; refreshToken: string; dealer: any };
  },
  login: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/dealer/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // bubble structured backend errors
      const code = data.error || data.code;
      const msg = data.message || data.error?.message || 'Dealer login failed';
      const err = new Error(msg) as any; err.code = code; throw err;
    }
    return data as { token: string; refreshToken: string; dealer: any };
  },
  refresh: async (refreshToken: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/dealer/refresh`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to refresh token');
    return data as { token: string; refreshToken: string; dealer: any };
  },
  logout: async (refreshToken?: string) => {
    try {
      await fetch(`${API_BASE_URL}/auth/dealer/logout`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ refreshToken }),
      });
    } catch {}
  }
};

// Dealer Domain API
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
    const res = await fetch(`${API_BASE_URL}/dealers/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
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
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory`, {
        method: 'POST',
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create inventory');
      return res.json();
    },
    get: async (dealerId: string, invId: string) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory/${invId}`);
      if (!res.ok) throw new Error('Failed to fetch inventory item');
      return res.json();
    },
    update: async (dealerId: string, invId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory/${invId}`, {
        method: 'PUT',
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update inventory');
      return res.json();
    },
    remove: async (dealerId: string, invId: string) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/inventory/${invId}`, {
        method: 'DELETE',
        headers: buildHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to delete inventory');
      return res.json();
    },
  },
  bookings: {
    list: async (dealerId: string, params?: { page?: number; limit?: number; status?: string }) => {
      const usp = new URLSearchParams();
      if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings${usp.toString() ? `?${usp.toString()}` : ''}`, {
        headers: buildHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
    create: async (dealerId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      return res.json();
    },
    update: async (dealerId: string, bookingId: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      return res.json();
    },
    get: async (dealerId: string, bookingId: string) => {
      const res = await fetch(`${API_BASE_URL}/dealers/${dealerId}/bookings/${bookingId}`, {
        headers: buildHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch booking');
      return res.json();
    },
  }
};
// Helper function to build headers
const buildHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Cars API
export const carsApi = {
  // Get all cars with optional filters
  getAll: async (filters?: {
    brand?: string;
    type?: string;
    fuelType?: string;
    transmission?: string;
    seating?: number;
    priceMin?: number;
    priceMax?: number;
    q?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/cars${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch cars');
    return response.json();
  },

  // Get single car by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`);
    if (!response.ok) throw new Error('Failed to fetch car');
    return response.json();
  },

  // Create new car
  create: async (carData: any) => {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(carData),
    });
    if (!response.ok) throw new Error('Failed to create car');
    return response.json();
  },

  // Update car
  update: async (id: string, carData: any) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(carData),
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  },

  // Delete car
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete car');
    return response.json();
  },

  // Upload images for a car
  uploadImages: async (id: string, files: File[], type: 'exterior' | 'interior' = 'exterior') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('type', type);
    
    const response = await fetch(`${API_BASE_URL}/cars/${id}/images`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload images');
    return response.json();
  },
};

// Auth API
export const authApi = {
  // Google sign-in
  googleSignIn: async (payload: { idToken?: string; email?: string; googleId?: string; name?: string; role?: 'client' | 'dealer' | 'service_provider' | 'mentor' }) => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Google sign-in failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },

  // Send OTP to phone
  sendOtp: async (phone: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/send`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ phone }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to send OTP');
    }
    return response.json();
  },

  // Verify OTP
  verifyOtp: async (phone: string, otp: string, role?: 'client' | 'dealer' | 'service_provider' | 'mentor') => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ phone, otp, role }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Invalid OTP');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },

  // Register new user
  register: async (userData: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    role?: 'client' | 'dealer' | 'service_provider';
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Registration failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Login
  login: async (credentials: {
    email?: string;
    phone?: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // Update user profile
  updateProfile: async (userData: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: buildHeaders(true),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    const data = await response.json();
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    try { window.dispatchEvent(new Event('auth-changed')); } catch {}
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Test Drive API
export const testDriveApi = {
  // Get cart
  getCart: async () => {
    const userId = authApi.getStoredUser()?.id;
    const response = await fetch(`${API_BASE_URL}/testdrive/cart`, {
      headers: {
        'x-user-id': userId || '',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  // Add car to cart
  addToCart: async (carId: string) => {
    const userId = authApi.getStoredUser()?.id;
    const response = await fetch(`${API_BASE_URL}/testdrive/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || '',
      },
      body: JSON.stringify({ carId }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  // Remove car from cart
  removeFromCart: async (carId: string) => {
    const userId = authApi.getStoredUser()?.id;
    const response = await fetch(`${API_BASE_URL}/testdrive/cart/items/${carId}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId || '',
      },
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  // Get pricing summary
  getPricingSummary: async () => {
    const userId = authApi.getStoredUser()?.id;
    const response = await fetch(`${API_BASE_URL}/testdrive/pricing-summary`, {
      headers: {
        'x-user-id': userId || '',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch pricing summary');
    return response.json();
  },

  // Checkout
  checkout: async (data: { preferredTime?: string; location?: string }) => {
    const userId = authApi.getStoredUser()?.id;
    const response = await fetch(`${API_BASE_URL}/testdrive/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || '',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to checkout');
    return response.json();
  },
};

export default {
  cars: carsApi,
  auth: authApi,
  dealerAuth: dealerAuthApi,
  dealer: dealerApi,
  testDrive: testDriveApi,
};
