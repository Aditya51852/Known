import React, { useState } from 'react';
import { carsApi } from '../services/api';

export const AdminCarUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    bodyType: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seating: 5,
    basePrice: 0,
    description: '',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imageType, setImageType] = useState<'exterior' | 'interior'>('exterior');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createdCarId, setCreatedCarId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seating' || name === 'basePrice' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create car
      const car = await carsApi.create(formData);
      setCreatedCarId(car._id);
      setMessage(`Car created successfully! ID: ${car._id}`);
      
      // Upload images if any
      if (images.length > 0) {
        await carsApi.uploadImages(car._id, images, imageType);
        setMessage(`Car created and ${images.length} images uploaded successfully!`);
      }
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seating: 5,
        basePrice: 0,
        description: '',
      });
      setImages([]);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create car'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMoreImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdCarId || images.length === 0) {
      setMessage('Please select images and create a car first');
      return;
    }

    setLoading(true);
    try {
      await carsApi.uploadImages(createdCarId, images, imageType);
      setMessage(`${images.length} additional images uploaded successfully!`);
      setImages([]);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to upload images'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-gray-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Admin - Upload Car</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-500/10 border border-red-500/20 text-red-300' 
              : 'bg-green-500/10 border border-green-500/20 text-green-300'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleCreateCar} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Car Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                placeholder="e.g., Fortuner"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Body Type *</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Wagon">Wagon</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Fuel Type *</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Transmission *</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="AMT">AMT</option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Seating Capacity *</label>
              <input
                type="number"
                name="seating"
                value={formData.seating}
                onChange={handleInputChange}
                required
                min="2"
                max="10"
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Base Price (₹) *</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                placeholder="e.g., 1500000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                placeholder="Enter car description..."
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xl font-semibold mb-4">Upload Images (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Image Type</label>
                <select
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value as 'exterior' | 'interior')}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                >
                  <option value="exterior">Exterior</option>
                  <option value="interior">Interior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-600 file:text-white file:cursor-pointer"
                />
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-4 text-sm text-gray-400">
                Selected {images.length} image{images.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg font-semibold transition"
            >
              {loading ? 'Creating...' : 'Create Car'}
            </button>
            
            {createdCarId && (
              <button
                type="button"
                onClick={() => window.location.href = `/car/${createdCarId}`}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                View Created Car
              </button>
            )}
          </div>
        </form>

        {createdCarId && (
          <form onSubmit={handleUploadMoreImages} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Upload More Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Image Type</label>
                <select
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value as 'exterior' | 'interior')}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
                >
                  <option value="exterior">Exterior</option>
                  <option value="interior">Interior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-600 file:text-white file:cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || images.length === 0}
              className="mt-6 px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition"
            >
              {loading ? 'Uploading...' : 'Upload Images'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
