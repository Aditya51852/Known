import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    preferences: {
      interestedBrands: [] as string[],
      budgetRange: {
        min: 0,
        max: 0
      }
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (name.startsWith('preferences.budgetRange.')) {
      const field = name.split('.')[2];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          budgetRange: {
            ...prev.preferences.budgetRange,
            [field]: parseInt(value) || 0
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBrandToggle = (brand: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        interestedBrands: prev.preferences.interestedBrands.includes(brand)
          ? prev.preferences.interestedBrands.filter(b => b !== brand)
          : [...prev.preferences.interestedBrands, brand]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.updateProfile(formData);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/profile');
  };

  const brands = ['Toyota', 'Honda', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Mahindra', 'Kia', 'MG', 'Skoda', 'Volkswagen'];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-gray-100 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">Help us personalize your car buying experience</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  step >= s
                    ? 'bg-orange-600 text-white'
                    : 'bg-white/5 text-gray-400 border border-white/10'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-2 rounded ${
                    step > s ? 'bg-orange-600' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Address Details</h2>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                  placeholder="House no., Street name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                    placeholder="6-digit pincode"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Your Preferences</h2>
              
              <div>
                <label className="block text-sm text-gray-400 mb-3">Interested Brands</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleBrandToggle(brand)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        formData.preferences.interestedBrands.includes(brand)
                          ? 'bg-orange-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Budget Range (₹)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="number"
                      name="preferences.budgetRange.min"
                      value={formData.preferences.budgetRange.min || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                      placeholder="Minimum budget"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="preferences.budgetRange.max"
                      value={formData.preferences.budgetRange.max || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                      placeholder="Maximum budget"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg font-semibold transition"
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition"
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
