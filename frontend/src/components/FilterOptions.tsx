import React, { useState } from 'react';

interface FilterOptionsProps {
  isVisible: boolean;
}

interface FilterState {
  feel: string[];
  brands: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmission: string;
  driveType: string;
  priceRange: [number, number];
  seatingCapacity: string[];
  colors: string[];
  safetyRating: number;
  ownershipType: string;
  priorities: string[];
  showAdvanced: boolean;
}

export function FilterOptions({ isVisible }: FilterOptionsProps) {
  const [filters, setFilters] = useState<FilterState>({
    feel: [],
    brands: [],
    bodyTypes: [],
    fuelTypes: [],
    transmission: '',
    driveType: '',
    priceRange: [300000, 30000000], // ₹3L to ₹3Cr
    seatingCapacity: [],
    colors: [],
    safetyRating: 3,
    ownershipType: '',
    priorities: [],
    showAdvanced: false
  });

  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  if (!isVisible) return null;

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleMultiSelect = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(value)
        ? (prev[category] as string[]).filter(item => item !== value)
        : [...(prev[category] as string[]), value]
    }));
  };

  const handleSingleSelect = (category: keyof FilterState, value: string | number) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const resetFilters = () => {
    setFilters({
      feel: [],
      brands: [],
      bodyTypes: [],
      fuelTypes: [],
      transmission: '',
      driveType: '',
      priceRange: [300000, 30000000],
      seatingCapacity: [],
      colors: [],
      safetyRating: 3,
      ownershipType: '',
      priorities: [],
      showAdvanced: false
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const FilterSection = ({ title, icon, children, sectionKey }: { 
    title: string; 
    icon: string; 
    children: React.ReactNode; 
    sectionKey: string;
  }) => {
    const isCollapsed = collapsedSections.includes(sectionKey);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h3 className="font-semibold text-gray-800">{title}</h3>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {!isCollapsed && children}
      </div>
    );
  };

  const feelOptions = ['Sporty', 'Comfortable', 'Luxurious', 'Rugged', 'Electric Silent', 'Minimalist', 'Family-oriented'];
  const brandOptions = ['Tesla', 'BMW', 'Audi', 'Mercedes', 'Toyota', 'Honda', 'Maruti', 'Mahindra', 'Tata', 'Hyundai'];
  const bodyTypeOptions = [
    { value: 'sedan', label: 'Sedan', icon: '🚗' },
    { value: 'suv', label: 'SUV', icon: '🚙' },
    { value: 'hatchback', label: 'Hatchback', icon: '🚗' },
    { value: 'coupe', label: 'Coupe', icon: '🏎️' },
    { value: 'convertible', label: 'Convertible', icon: '🚗' },
    { value: 'pickup', label: 'Pickup', icon: '🛻' },
    { value: 'mpv', label: 'MPV', icon: '🚐' },
    { value: 'van', label: 'Van', icon: '🚐' },
    { value: 'crossover', label: 'Crossover', icon: '🚙' }
  ];
  const fuelTypeOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissionOptions = ['Manual', 'Automatic', 'CVT', 'AMT'];
  const driveTypeOptions = ['FWD', 'RWD', 'AWD', '4WD'];
  const seatingOptions = [2, 4, 5, 6, 7, 8];
  const colorOptions = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Orange', value: '#FFA500' }
  ];
  const ownershipOptions = ['New', 'Used', 'Certified Pre-owned'];


  return (
    <div className="mt-6 bg-gray-50 rounded-2xl p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Feel (Driving Experience) */}
        <FilterSection title="Feel" icon="🎯" sectionKey="feel">
          <div className="flex flex-wrap gap-2">
            {feelOptions.map(feel => (
              <button
                key={feel}
                onClick={() => handleMultiSelect('feel', feel)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.feel.includes(feel)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {feel}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Brand */}
        <FilterSection title="Brand" icon="🏷️" sectionKey="brand">
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {brandOptions.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleMultiSelect('brands', brand)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Body Type */}
        <FilterSection title="Body Type" icon="🚗" sectionKey="bodyType">
          <div className="grid grid-cols-3 gap-2">
            {bodyTypeOptions.map(type => (
              <button
                key={type.value}
                onClick={() => handleMultiSelect('bodyTypes', type.value)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                  filters.bodyTypes.includes(type.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-lg mb-1">{type.icon}</span>
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection title="Fuel Type" icon="⛽" sectionKey="fuelType">
          <div className="flex flex-wrap gap-2">
            {fuelTypeOptions.map(fuel => (
              <label key={fuel} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.fuelTypes.includes(fuel)}
                  onChange={() => handleMultiSelect('fuelTypes', fuel)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{fuel}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection title="Transmission" icon="⚙️" sectionKey="transmission">
          <div className="space-y-2">
            {transmissionOptions.map(trans => (
              <label key={trans} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === trans}
                  onChange={() => handleSingleSelect('transmission', trans)}
                  className="border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{trans}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Drive Type */}
        <FilterSection title="Drive Type" icon="🔄" sectionKey="driveType">
          <div className="flex flex-wrap gap-2">
            {driveTypeOptions.map(drive => (
              <button
                key={drive}
                onClick={() => handleSingleSelect('driveType', drive)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.driveType === drive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {drive}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Price Range - Full Width */}
      <FilterSection title="Price Range" icon="💰" sectionKey="priceRange">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
          <input
            type="range"
            min="300000"
            max="30000000"
            step="100000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </FilterSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Seating Capacity */}
        <FilterSection title="Seating" icon="👥" sectionKey="seating">
          <div className="flex flex-wrap gap-2">
            {seatingOptions.map(seats => (
              <button
                key={seats}
                onClick={() => handleMultiSelect('seatingCapacity', seats.toString())}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  filters.seatingCapacity.includes(seats.toString())
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {seats}{seats === 8 ? '+' : ''}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Color Preference */}
        <FilterSection title="Color" icon="🎨" sectionKey="color">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, colors: [] }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                filters.colors.length === 0
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              No Preference
            </button>
            {colorOptions.map(color => (
              <button
                key={color.name}
                onClick={() => handleMultiSelect('colors', color.name)}
                className={`w-8 h-8 rounded-full border-2 ${
                  filters.colors.includes(color.name)
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </FilterSection>

        {/* Safety Rating */}
        <FilterSection title="Safety Rating" icon="🛡️" sectionKey="safety">
          <div className="flex items-center gap-2">
            {[3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleSingleSelect('safetyRating', rating)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                  filters.safetyRating === rating
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{rating}</span>
                <span className="text-yellow-400">★</span>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Ownership Type */}
      <div className="mt-4">
        <FilterSection title="Ownership Type" icon="🔑" sectionKey="ownership">
          <div className="flex gap-4">
            {ownershipOptions.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ownership"
                  checked={filters.ownershipType === type}
                  onChange={() => handleSingleSelect('ownershipType', type)}
                  className="border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Advanced Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setFilters(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>Advanced Filters</span>
          <svg 
            className={`w-4 h-4 transition-transform ${filters.showAdvanced ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <span>🎯</span>
          Find My Match
        </button>
        <button 
          onClick={resetFilters}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
        <button className="px-6 py-3 border border-blue-300 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}