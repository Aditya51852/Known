const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
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
  googleSignIn: async (payload: { idToken?: string; email?: string; googleId?: string; name?: string }) => {
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
  verifyOtp: async (phone: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ phone, otp }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Invalid OTP');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
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
  testDrive: testDriveApi,
};
