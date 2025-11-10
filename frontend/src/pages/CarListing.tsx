import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../services/api';

interface Car {
  _id: string;
  brand: string;
  model: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  seating: number;
  basePrice: number;
  description?: string;
  images: Array<{
    url: string;
    type: string;
    alt: string;
  }>;
}

export const CarListing: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    type: '',
    fuelType: '',
    transmission: '',
    priceMin: '',
    priceMax: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const filterParams: any = {};
      
      if (filters.brand) filterParams.brand = filters.brand;
      if (filters.type) filterParams.type = filters.type;
      if (filters.fuelType) filterParams.fuelType = filters.fuelType;
      if (filters.transmission) filterParams.transmission = filters.transmission;
      if (filters.priceMin) filterParams.priceMin = parseInt(filters.priceMin);
      if (filters.priceMax) filterParams.priceMax = parseInt(filters.priceMax);
      
      const data = await carsApi.getAll(filterParams);
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchCars();
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      type: '',
      fuelType: '',
      transmission: '',
      priceMin: '',
      priceMax: '',
    });
    setTimeout(fetchCars, 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Browse Cars</h1>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Brands</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Maruti Suzuki">Maruti Suzuki</option>
                <option value="Tata">Tata</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Body Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              >
                <option value="">All</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                placeholder="₹0"
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Price</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                placeholder="₹10000000"
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-gray-400">Loading cars...</div>
          </div>
        ) : cars.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-xl text-gray-400 mb-2">No cars found</div>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Showing {cars.length} car{cars.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Link
                  key={car._id}
                  to={`/car/${car._id}`}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/50 transition"
                >
                  <div className="relative aspect-[16/10] bg-black/40 overflow-hidden">
                    <img
                      src={car.images[0]?.url || 'https://via.placeholder.com/800x600?text=No+Image'}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs bg-black/60 backdrop-blur border border-white/10">
                      {car.bodyType}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">
                      {car.brand} {car.model}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        {car.fuelType}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-green-500/15 text-green-300 border border-green-500/20">
                        {car.transmission}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/15 text-purple-300 border border-purple-500/20">
                        {car.seating} Seater
                      </span>
                    </div>

                    {car.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {car.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400">Starting from</div>
                        <div className="text-2xl font-bold text-orange-400">
                          {formatPrice(car.basePrice)}
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-semibold transition">
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
