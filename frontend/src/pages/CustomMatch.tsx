import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FilterOptions {
  interest: string[];
  feel: string[];
  brand: string[];
  type: string[];
  priceRange: [number, number];
  fuelType: string[];
  transmission: string[];
  seating: string[];
}

export default function CustomMatch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterOptions>({
    interest: [],
    feel: [],
    brand: [],
    type: [],
    priceRange: [500000, 5000000],
    fuelType: [],
    transmission: [],
    seating: []
  });

  const filterOptions = {
    interest: [
      'Performance', 'Luxury', 'Economy', 'Adventure', 'City Driving', 
      'Long Distance', 'Off-road', 'Racing', 'Family', 'Business'
    ],
    feel: [
      'Sporty', 'Comfortable', 'Luxurious', 'Rugged', 'Elegant', 
      'Modern', 'Classic', 'Aggressive', 'Smooth', 'Dynamic'
    ],
    brand: [
      'Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'Honda', 'Hyundai',
      'Maruti Suzuki', 'Tata', 'Mahindra', 'Ford', 'Volkswagen', 'Skoda'
    ],
    type: [
      'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon',
      'Pickup Truck', 'Crossover', 'Sports Car', 'Luxury Car'
    ],
    fuelType: [
      'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'
    ],
    transmission: [
      'Manual', 'Automatic', 'CVT', 'AMT'
    ],
    seating: [
      '2 Seater', '4 Seater', '5 Seater', '7 Seater', '8+ Seater'
    ]
  };

  const handleMultiSelect = (category: keyof FilterOptions, value: string) => {
    if (category === 'priceRange') return;
    
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFilters(prev => ({
      ...prev,
      [category]: newValues
    }));
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    setFilters(prev => ({
      ...prev,
      priceRange: newRange
    }));
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const handleSearch = () => {
    // Here you would typically make an API call with the filters
    console.log('Searching with filters:', filters);
    // Navigate to results page or show results
    navigate('/search-results', { state: { filters } });
  };

  const resetFilters = () => {
    setFilters({
      interest: [],
      feel: [],
      brand: [],
      type: [],
      priceRange: [500000, 5000000],
      fuelType: [],
      transmission: [],
      seating: []
    });
  };

  const getSelectedCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'priceRange') return count;
      return count + (value as string[]).length;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Custom Car Match</h1>
              <p className="text-gray-600 mt-2">Customize your preferences to find the perfect car</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{getSelectedCount()}</div>
              <div className="text-sm text-gray-500">Filters Selected</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                    <input
                      type="range"
                      min={100000}
                      max={10000000}
                      step={100000}
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">{formatPrice(filters.priceRange[0])}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                    <input
                      type="range"
                      min={100000}
                      max={10000000}
                      step={100000}
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">{formatPrice(filters.priceRange[1])}</div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-4"
              >
                Find Matches ({getSelectedCount()} filters)
              </button>

              <div className="text-xs text-gray-500">
                Select multiple options in each category to refine your search
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Interest */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">What interests you?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filterOptions.interest.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('interest', option)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.interest.includes(option)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feel */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">How do you want to feel?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filterOptions.feel.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('feel', option)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.feel.includes(option)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Preferred Brands</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filterOptions.brand.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('brand', option)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.brand.includes(option)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Type */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Car Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filterOptions.type.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMultiSelect('type', option)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.type.includes(option)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Fuel Type */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fuel Type</h3>
                  <div className="space-y-2">
                    {filterOptions.fuelType.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleMultiSelect('fuelType', option)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                          filters.fuelType.includes(option)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Transmission</h3>
                  <div className="space-y-2">
                    {filterOptions.transmission.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleMultiSelect('transmission', option)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                          filters.transmission.includes(option)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Seating Capacity</h3>
                  <div className="space-y-2">
                    {filterOptions.seating.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleMultiSelect('seating', option)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                          filters.seating.includes(option)
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
