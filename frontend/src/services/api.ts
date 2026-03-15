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
  googleSignIn: async (payload: { token?: string; idToken?: string; email?: string; googleId?: string; name?: string; role?: 'client' | 'dealer' | 'service_provider' | 'mentor' }) => {
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

// ──────────────────────────────────────────────
// Bargain Arena API
// ──────────────────────────────────────────────
export const bargainApi = {
  // Client: Show interest and create arena
  showInterest: async (carId: string) => {
    const response = await fetch(`${API_BASE_URL}/bargain/interest`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify({ carId }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to create arena');
    }
    return response.json();
  },

  // Client: List my bargain sessions
  getSessions: async () => {
    const response = await fetch(`${API_BASE_URL}/bargain/sessions`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  // Client: View arena room (anonymous bulletins)
  getArena: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/bargain/arena/${sessionId}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch arena');
    return response.json();
  },

  // Client: Lock a bulletin
  lockOffer: async (sessionId: string, anonymousTokenId: string, tokenPaymentAmount: number = 5000) => {
    const response = await fetch(`${API_BASE_URL}/bargain/lock`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify({ sessionId, anonymousTokenId, tokenPaymentAmount }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to lock offer');
    }
    return response.json();
  },

  // Client: Cancel session
  cancelSession: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/bargain/cancel/${sessionId}`, {
      method: 'POST',
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to cancel session');
    return response.json();
  },

  // Dealer: Get open arenas
  getOpenArenas: async () => {
    const response = await fetch(`${API_BASE_URL}/bargain/dealer/open-arenas`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch open arenas');
    return response.json();
  },

  // Dealer: Submit bulletin
  submitBulletin: async (data: {
    sessionId: string;
    offeredPrice: number;
    priceBreakdown?: any;
    offers?: string[];
    discounts?: string[];
    financingOptions?: any;
    estimatedDeliveryDays?: number;
    freeAccessories?: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/bargain/bulletin`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to submit bulletin');
    }
    return response.json();
  },

  // Dealer: Get my bulletin for a session
  getMyBulletin: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/bargain/dealer/bulletin/${sessionId}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch bulletin');
    return response.json();
  },
};

// ──────────────────────────────────────────────
// Mentors API
// ──────────────────────────────────────────────
export const mentorsApi = {
  // List mentors
  list: async (params?: { specialization?: string; minRating?: number; page?: number; limit?: number }) => {
    const usp = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
    const response = await fetch(`${API_BASE_URL}/mentors${usp.toString() ? `?${usp}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch mentors');
    return response.json();
  },

  // Get mentor profile with reviews
  getProfile: async (mentorId: string) => {
    const response = await fetch(`${API_BASE_URL}/mentors/${mentorId}`);
    if (!response.ok) throw new Error('Failed to fetch mentor');
    return response.json();
  },

  // Request consultation
  requestConsultation: async (mentorId: string, data: { carId?: string; scheduledAt?: string; clientMessage?: string }) => {
    const response = await fetch(`${API_BASE_URL}/mentors/${mentorId}/consult`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to request consultation');
    }
    return response.json();
  },

  // Get my consultations (client)
  getMyConsultations: async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/consultations/mine`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch consultations');
    return response.json();
  },

  // Get assigned consultations (mentor)
  getAssignedConsultations: async () => {
    const response = await fetch(`${API_BASE_URL}/mentors/consultations/assigned`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch assigned consultations');
    return response.json();
  },

  // Update consultation status (mentor)
  updateConsultationStatus: async (consultationId: string, status: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/mentors/consultations/${consultationId}/status`, {
      method: 'PATCH',
      headers: buildHeaders(true),
      body: JSON.stringify({ status, notes }),
    });
    if (!response.ok) throw new Error('Failed to update consultation');
    return response.json();
  },

  // Send chat message
  sendMessage: async (consultationId: string, message: string) => {
    const response = await fetch(`${API_BASE_URL}/mentors/chat/${consultationId}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  // Get chat messages
  getMessages: async (consultationId: string) => {
    const response = await fetch(`${API_BASE_URL}/mentors/chat/${consultationId}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  // Submit review for mentor
  submitReview: async (mentorId: string, data: { rating: number; title?: string; comment?: string; consultationId?: string }) => {
    const response = await fetch(`${API_BASE_URL}/mentors/${mentorId}/review`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  },
};

// ──────────────────────────────────────────────
// Notifications API
// ──────────────────────────────────────────────
export const notificationsApi = {
  // Get notifications
  getAll: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const usp = new URLSearchParams();
    if (params) {
      if (params.page) usp.append('page', String(params.page));
      if (params.limit) usp.append('limit', String(params.limit));
      if (params.unreadOnly) usp.append('unreadOnly', 'true');
    }
    const response = await fetch(`${API_BASE_URL}/notifications${usp.toString() ? `?${usp}` : ''}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  // Mark as read
  markRead: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to mark as read');
    return response.json();
  },

  // Mark all as read
  markAllRead: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
    return response.json();
  },

  // Delete notification
  remove: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json();
  },
};

// ──────────────────────────────────────────────
// Wishlist API
// ──────────────────────────────────────────────
export const wishlistApi = {
  // Get wishlist
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  },

  // Add to wishlist
  add: async (carId: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify({ carId }),
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  },

  // Remove from wishlist
  remove: async (carId: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/${carId}`, {
      method: 'DELETE',
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return response.json();
  },

  // Check if car is in wishlist
  check: async (carId: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/check/${carId}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to check wishlist');
    return response.json();
  },
};

// ──────────────────────────────────────────────
// Admin API
// ──────────────────────────────────────────────
export const adminApi = {
  // Platform stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // List users
  getUsers: async (params?: { role?: string; page?: number; limit?: number; q?: string }) => {
    const usp = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
    const response = await fetch(`${API_BASE_URL}/admin/users${usp.toString() ? `?${usp}` : ''}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Update user role
  updateUserRole: async (userId: string, role: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: buildHeaders(true),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update role');
    return response.json();
  },

  // List bargain sessions
  getBargainSessions: async (params?: { status?: string; page?: number; limit?: number }) => {
    const usp = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
    const response = await fetch(`${API_BASE_URL}/admin/bargain-sessions${usp.toString() ? `?${usp}` : ''}`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch bargain sessions');
    return response.json();
  },

  // Dealer dashboard stats
  getDealerStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dealer-stats`, {
      headers: buildHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch dealer stats');
    return response.json();
  },
};

// ──────────────────────────────────────────────
// Reviews API
// ──────────────────────────────────────────────
export const reviewsApi = {
  // Get reviews for a target
  getForTarget: async (targetId: string, targetModel: 'User' | 'Dealer' | 'Car', params?: { page?: number; limit?: number }) => {
    const usp = new URLSearchParams({ targetId, targetModel });
    if (params) Object.entries(params).forEach(([k, v]) => v != null && usp.append(k, String(v)));
    const response = await fetch(`${API_BASE_URL}/reviews?${usp}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  // Submit review
  submit: async (data: { targetId: string; targetModel: string; rating: number; title?: string; comment?: string }) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  },
};

export default {
  cars: carsApi,
  auth: authApi,
  dealerAuth: dealerAuthApi,
  dealer: dealerApi,
  testDrive: testDriveApi,
  bargain: bargainApi,
  mentors: mentorsApi,
  notifications: notificationsApi,
  wishlist: wishlistApi,
  admin: adminApi,
  reviews: reviewsApi,
};

