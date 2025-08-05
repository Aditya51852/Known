import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface CarImage {
  id: string;
  url: string;
  type: 'exterior' | 'interior';
  alt: string;
}

interface EngineOption {
  id: string;
  title: string;
  acceleration: string;
  topSpeed: string;
  gearType: string;
  gears: number;
}

interface CarVariant {
  id: string;
  name: string;
  basePrice: number;
  features: string[];
}

interface CarDetails {
  engine: Record<string, string>;
  body: Record<string, string>;
  comfort: Record<string, string>;
  entertainment: Record<string, string>;
  features: Record<string, string>;
  safety: Record<string, string>;
}

interface Review {
  id: string;
  rating: number;
  pros: string[];
  cons: string[];
  reviewer: string;
}

interface CarData {
  id: string;
  name: string;
  brand: string;
  fuelType: string;
  bodyType: string;
  engineType: string;
  images: CarImage[];
  engineOptions: EngineOption[];
  variants: CarVariant[];
  details: CarDetails;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

// Mock data - replace with actual API call
const mockCarData: CarData = {
  id: '1',
  name: 'Toyota Supra GR',
  brand: 'Toyota',
  fuelType: 'Petrol',
  bodyType: 'Coupe',
  engineType: 'Inline-6',
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', type: 'exterior', alt: 'Toyota Supra exterior front' },
    { id: '2', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', type: 'exterior', alt: 'Toyota Supra exterior side' },
    { id: '3', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop', type: 'exterior', alt: 'Toyota Supra exterior rear' },
    { id: '4', url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop', type: 'interior', alt: 'Toyota Supra interior dashboard' },
    { id: '5', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', type: 'interior', alt: 'Toyota Supra interior seats' },
    { id: '6', url: 'https://images.unsplash.com/photo-1606016159991-d3bdc9d2991b?w=800&h=600&fit=crop', type: 'interior', alt: 'Toyota Supra interior rear' },
  ],
  engineOptions: [
    {
      id: '1',
      title: '3.0L 2JZ-GTE Inline 6-Cylinder',
      acceleration: '4.3s',
      topSpeed: '250 km/h',
      gearType: 'Automatic',
      gears: 8
    }
  ],
  variants: [
    { id: '1', name: 'Base', basePrice: 4500000, features: ['LED Headlights', 'Dual Zone AC', 'Touchscreen Infotainment'] },
    { id: '2', name: 'Premium', basePrice: 5200000, features: ['Premium Audio', 'Leather Seats', 'Sunroof', 'Adaptive Cruise Control'] },
    { id: '3', name: 'Track Edition', basePrice: 6000000, features: ['Track Suspension', 'Carbon Fiber Parts', 'Racing Seats', 'Performance Brakes'] }
  ],
  details: {
    engine: {
      'Engine Type': 'Inline-6 Turbocharged',
      'Displacement': '2998 cc',
      'Max Power': '340 HP @ 5000-6500 rpm',
      'Max Torque': '500 Nm @ 1600-4500 rpm',
      'Transmission': '8-Speed Automatic',
      'Drivetrain': 'Rear-Wheel Drive'
    },
    body: {
      'Body Type': '2-Door Coupe',
      'Length': '4379 mm',
      'Width': '1854 mm',
      'Height': '1291 mm',
      'Wheelbase': '2470 mm',
      'Ground Clearance': '125 mm',
      'Kerb Weight': '1520 kg'
    },
    comfort: {
      'Seating Capacity': '2 Persons',
      'Seat Material': 'Leather',
      'Front Seats': 'Power Adjustable',
      'Climate Control': 'Dual Zone Automatic',
      'Steering': 'Power Assisted',
      'Suspension Front': 'MacPherson Strut',
      'Suspension Rear': 'Multi-Link'
    },
    entertainment: {
      'Infotainment Screen': '8.8-inch Touchscreen',
      'Sound System': 'JBL Premium Audio',
      'Speakers': '12 Speakers',
      'Connectivity': 'Apple CarPlay, Android Auto',
      'USB Ports': '2',
      'Bluetooth': 'Yes',
      'Navigation': 'Built-in GPS'
    },
    features: {
      'Keyless Entry': 'Yes',
      'Push Button Start': 'Yes',
      'Cruise Control': 'Adaptive',
      'Drive Modes': '4 (Eco, Normal, Sport, Track)',
      'Ambient Lighting': 'Multi-color LED',
      'Sunroof': 'Electric',
      'Auto Headlights': 'Yes',
      'Rain Sensing Wipers': 'Yes'
    },
    safety: {
      'Airbags': '8 Airbags',
      'ABS': 'Yes',
      'EBD': 'Yes',
      'ESP': 'Yes',
      'Traction Control': 'Yes',
      'Hill Start Assist': 'Yes',
      'ISOFIX': 'Yes',
      'Safety Rating': '5 Star NCAP'
    }
  },
  reviews: [
    {
      id: '1',
      rating: 5,
      pros: ['Incredible performance', 'Beautiful design', 'Great handling'],
      cons: ['Limited rear visibility', 'Firm suspension'],
      reviewer: 'John D.'
    },
    {
      id: '2',
      rating: 4,
      pros: ['Powerful engine', 'Premium interior', 'Advanced tech'],
      cons: ['High maintenance cost', 'Limited storage'],
      reviewer: 'Sarah M.'
    }
  ],
  averageRating: 4.6,
  totalReviews: 127
};

const locations = [
  { id: '1', name: 'Mumbai', taxRate: 0.15 },
  { id: '2', name: 'Delhi', taxRate: 0.12 },
  { id: '3', name: 'Bangalore', taxRate: 0.14 },
  { id: '4', name: 'Chennai', taxRate: 0.13 },
  { id: '5', name: 'Pune', taxRate: 0.16 }
];

export const CarDetail: React.FC = () => {
  const { carId } = useParams();
  
  // State management
  const [carData, setCarData] = useState<CarData | null>(null);
  const [selectedExteriorImage, setSelectedExteriorImage] = useState(0);
  const [selectedInteriorImage, setSelectedInteriorImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('1');
  const [selectedLocation, setSelectedLocation] = useState('1');
  const [activeTab, setActiveTab] = useState('engine');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(4000000);
  const [tenure, setTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);

  useEffect(() => {
    // Simulate API call
    setCarData(mockCarData);
  }, [carId]);

  if (!carData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const exteriorImages = carData.images.filter(img => img.type === 'exterior');
  const interiorImages = carData.images.filter(img => img.type === 'interior');
  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);
  const selectedVariantData = carData.variants.find(v => v.id === selectedVariant);
  
  const exShowroomPrice = selectedVariantData?.basePrice || 0;
  const onRoadPrice = exShowroomPrice * (1 + (selectedLocationData?.taxRate || 0.15));

  // EMI Calculation
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenure * 12;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayable = emi * totalMonths;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const departmentTabs = [
    { id: 'engine', label: 'Engine', icon: '🔧', data: carData.details.engine },
    { id: 'body', label: 'Body', icon: '🚗', data: carData.details.body },
    { id: 'comfort', label: 'Comfort', icon: '🛋️', data: carData.details.comfort },
    { id: 'entertainment', label: 'Entertainment', icon: '🎵', data: carData.details.entertainment },
    { id: 'features', label: 'Features', icon: '✨', data: carData.details.features },
    { id: 'safety', label: 'Safety', icon: '🛡️', data: carData.details.safety }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20">
      {/* Top Section - Image Display (50-50 Split) */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exterior Images */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Exterior</h3>
              <div className="relative">
                <img 
                  src={exteriorImages[selectedExteriorImage]?.url} 
                  alt={exteriorImages[selectedExteriorImage]?.alt}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <button 
                  onClick={() => setSelectedExteriorImage(prev => prev > 0 ? prev - 1 : exteriorImages.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedExteriorImage(prev => prev < exteriorImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {exteriorImages.map((image, index) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.alt}
                    className={`w-20 h-16 object-cover rounded cursor-pointer flex-shrink-0 ${
                      selectedExteriorImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedExteriorImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Interior Images */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Interior</h3>
              <div className="relative">
                <img 
                  src={interiorImages[selectedInteriorImage]?.url} 
                  alt={interiorImages[selectedInteriorImage]?.alt}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <button 
                  onClick={() => setSelectedInteriorImage(prev => prev > 0 ? prev - 1 : interiorImages.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedInteriorImage(prev => prev < interiorImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {interiorImages.map((image, index) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.alt}
                    className={`w-20 h-16 object-cover rounded cursor-pointer flex-shrink-0 ${
                      selectedInteriorImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedInteriorImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content (60-40 Layout) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column (60%) */}
            <div className="lg:col-span-3">
              {/* Car Title Section */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{carData.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {carData.brand}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {carData.fuelType}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {carData.bodyType}
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {carData.engineType}
                  </span>
                </div>
              </div>

              {/* Engine Options */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Engine Options</h2>
                {carData.engineOptions.map((engine) => (
                  <div key={engine.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{engine.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">0-100 km/h</span>
                        <p className="font-semibold">{engine.acceleration}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Top Speed</span>
                        <p className="font-semibold">{engine.topSpeed}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Transmission</span>
                        <p className="font-semibold">{engine.gearType}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Gears</span>
                        <p className="font-semibold">{engine.gears}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Model Selection */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Model Selection</h2>
                <select 
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {carData.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name} - {formatPrice(variant.basePrice)}
                    </option>
                  ))}
                </select>
                {selectedVariantData && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVariantData.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Car Details (Departmental Tabs) */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Car Details</h2>
                <div className="flex flex-wrap gap-2 mb-6 border-b">
                  {departmentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(departmentTabs.find(tab => tab.id === activeTab)?.data || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (40%) */}
            <div className="lg:col-span-2">
              {/* User Input Controls */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </label>
                    <select 
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ex-showroom Price</span>
                    <span className="font-semibold text-lg">{formatPrice(exShowroomPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-road Price ({selectedLocationData?.name})</span>
                    <span className="font-bold text-xl text-blue-600">{formatPrice(onRoadPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-semibold text-lg">{carData.averageRating}</span>
                  </div>
                  <span className="ml-2 text-gray-600">({carData.totalReviews} reviews)</span>
                </div>
                <div className="space-y-4">
                  {carData.reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">by {review.reviewer}</span>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="font-medium text-green-600">Pros: </span>
                          {review.pros.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium text-red-600">Cons: </span>
                          {review.cons.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EMI Calculator */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  EMI Calculator
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount: {formatPrice(loanAmount)}
                    </label>
                    <input
                      type="range"
                      min={1000000}
                      max={onRoadPrice}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenure: {tenure} years
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={7}
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate: {interestRate}%
                    </label>
                    <input
                      type="range"
                      min={6}
                      max={15}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Monthly EMI</span>
                      <span className="font-bold text-blue-600">{formatPrice(emi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Payable</span>
                      <span className="font-bold">{formatPrice(totalPayable)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      isBookmarked 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center justify-center px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Compare
                  </button>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Test Drive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
