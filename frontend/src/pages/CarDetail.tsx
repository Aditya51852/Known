import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { carsApi, testDriveApi } from '../services/api';

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
  modelYear?: number;
  description?: string;
  seating?: number;
  efficiency?: string;
  transmission?: string;
  availableColors?: string[];
}

// Mock data - replace with actual API call
const mockCarData: CarData = {
  id: '1',
  name: 'Toyota Supra GR',
  brand: 'Toyota',
  fuelType: 'Petrol',
  bodyType: 'Coupe',
  engineType: 'Inline-6',
  modelYear: 2024,
  description:
    'The Toyota GR Supra blends a legendary nameplate with modern performance. With its turbocharged inline-6, precise handling, and premium interior, it delivers an engaging drive and everyday usability.',
  seating: 2,
  efficiency: '12.8 km/l',
  transmission: '8-Speed Automatic',
  availableColors: ['Super White', 'Nitro Yellow', 'Renaissance Red', 'Nocturnal Black', 'Turbulence Grey'],
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('1');
  const [selectedLocation, setSelectedLocation] = useState('1');
  const [activeTab, setActiveTab] = useState('engine');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  
  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(4000000);
  const [tenure, setTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        if (!carId) return;
        const car = await carsApi.getById(carId);
        
        // Transform backend data to match frontend interface
        const transformedCar: CarData = {
          id: car._id,
          name: `${car.brand} ${car.model}`,
          brand: car.brand,
          fuelType: car.fuelType,
          bodyType: car.bodyType,
          engineType: car.details?.engine?.['Engine Type'] || 'N/A',
          images: car.images || [],
          engineOptions: [{
            id: '1',
            title: car.details?.engine?.['Engine Type'] || 'Engine',
            acceleration: '0-100 km/h',
            topSpeed: car.details?.engine?.['Top Speed'] || 'N/A',
            gearType: car.transmission || 'Automatic',
            gears: 6
          }],
          variants: car.variants || [],
          details: car.details || {},
          reviews: [],
          averageRating: 4.5,
          totalReviews: 0,
          modelYear: new Date().getFullYear(),
          description: car.description || '',
          seating: car.seating || 5,
          efficiency: car.details?.engine?.['Efficiency'] || 'N/A',
          transmission: car.transmission || 'Automatic',
          availableColors: ['White', 'Black', 'Silver', 'Red', 'Blue']
        };
        
        setCarData(transformedCar);
      } catch (error) {
        console.error('Error fetching car:', error);
        // Fallback to mock data if API fails
        setCarData(mockCarData);
      }
    };
    
    fetchCarData();
  }, [carId]);

  if (!carData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const allImages = carData.images;
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
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#0B0B0C] text-gray-100 dark:bg-[#0B0B0C] dark:text-gray-100 pt-24">
        {/* Top Toolbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-400">Theme</span>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="px-3 py-1.5 rounded-full bg-gray-800/60 hover:bg-gray-700/70 text-xs border border-white/10"
            >
              {darkMode ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        {/* Hero + Right Details */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Hero + Thumbs */}
              <div className="w-full">
                <div className="relative group overflow-hidden rounded-xl bg-black/40">
                  <img
                    src={allImages[selectedImage]?.url}
                    alt={allImages[selectedImage]?.alt}
                    className="w-full aspect-[16/10] object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  {/* Nav arrows */}
                  <button
                    aria-label="Prev image"
                    onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : allImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => setSelectedImage((p) => (p < allImages.length - 1 ? p + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border ${
                        selectedImage === i ? 'border-orange-500' : 'border-white/10'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      {img.type === 'interior' && (
                        <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                          Interior
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Details panel */}
              <div className="space-y-5">
                <div className="rounded-xl bg-white/5 border border-white/10 p-5 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {carData.name}
                      </h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {carData.modelYear && (
                          <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-gray-200">
                            {carData.modelYear}
                          </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-500/15 text-blue-300 border border-blue-500/20">
                          {carData.brand}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-green-500/15 text-green-300 border border-green-500/20">
                          {carData.fuelType}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-500/20">
                          {carData.bodyType}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-orange-500/15 text-orange-300 border border-orange-500/20">
                          {carData.engineType}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsBookmarked((s) => {
                          const next = !s;
                          try {
                            const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
                            const item = { id: carData.id, name: carData.name, brand: carData.brand };
                            const exists = favs.some((f: any) => f.id === item.id);
                            let updated = favs;
                            if (next && !exists) {
                              updated = [...favs, item];
                            } else if (!next && exists) {
                              updated = favs.filter((f: any) => f.id !== item.id);
                            }
                            localStorage.setItem('favourites', JSON.stringify(updated));
                          } catch {}
                          return next;
                        });
                      }}
                      className={`p-2 rounded-lg border transition ${
                        isBookmarked
                          ? 'bg-red-500/10 text-red-300 border-red-500/20'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                      aria-label="Save"
                    >
                      <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs uppercase text-gray-400">Ex-showroom from</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-orange-400 tracking-tight">
                      {formatPrice(exShowroomPrice)}
                    </div>
                  </div>

                  {carData.description && (
                    <p className="mt-4 text-sm leading-relaxed text-gray-300">
                      {carData.description}
                    </p>
                  )}
                </div>

                {/* Specs cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Fuel', value: carData.fuelType, icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6v10a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2z"/></svg>
                    ) },
                    { label: 'Transmission', value: carData.transmission || 'Automatic', icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-9h6m-6 6h6"/></svg>
                    ) },
                    { label: 'Seating', value: `${carData.seating || 2} Seater`, icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M7 12V7a3 3 0 016 0v5"/></svg>
                    ) },
                    { label: 'Efficiency', value: carData.efficiency || '—', icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    ) },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300">{s.icon}</div>
                      <div>
                        <div className="text-xs text-gray-400">{s.label}</div>
                        <div className="text-sm font-medium">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Colors */}
                {carData.availableColors && (
                  <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <div className="text-sm font-semibold mb-3">Available Colors</div>
                    <div className="flex flex-wrap gap-2">
                      {carData.availableColors.map((c) => (
                        <button
                          key={c}
                          className="px-3 py-1.5 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={async () => {
                      try {
                        if (carData?.id) {
                          await testDriveApi.addToCart(carData.id);
                          setShowBooking(true);
                        }
                      } catch (error) {
                        console.error('Error adding to test drive cart:', error);
                        alert('Failed to add car to test drive. Please try again.');
                      }
                    }}
                    className="col-span-2 sm:col-span-3 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20"
                  >
                    Select Car for Test Drive
                  </button>
                  <a
                    href={`/bargein/select-car?brand=${encodeURIComponent(carData.brand)}&model=${encodeURIComponent(carData.name)}`}
                    className="w-full text-center px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white border border-white/10"
                  >
                    Enter Bargein Arena
                  </a>
                  <a
                    href="tel:+911234567890"
                    className="w-full text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    Call Dealer
                  </a>
                  <a
                    href={`https://wa.me/911234567890?text=I%20am%20interested%20in%20${encodeURIComponent(carData.name)}`}
                    target="_blank" rel="noreferrer"
                    className="w-full text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    WhatsApp
                  </a>
                  <button className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">Share</button>
                  <button className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">Compare</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs + Config + Pricing + Reviews */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left - Tabs */}
              <div className="lg:col-span-3 space-y-6">
                {/* Engine Options quick specs */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <h2 className="text-lg font-semibold mb-4">Engine Options</h2>
                  <div className="space-y-4">
                    {carData.engineOptions.map((engine) => (
                      <div key={engine.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <h3 className="font-semibold mb-3">{engine.title}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">0-100 km/h</div>
                            <div className="font-medium">{engine.acceleration}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Top Speed</div>
                            <div className="font-medium">{engine.topSpeed}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Transmission</div>
                            <div className="font-medium">{engine.gearType}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Gears</div>
                            <div className="font-medium">{engine.gears}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2 mb-4">
                    {departmentTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition ${
                          activeTab === tab.id
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="mr-1">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(departmentTabs.find(t => t.id === activeTab)?.data || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm">
                        <span className="text-gray-400">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Config, Pricing, Reviews */}
              <div className="lg:col-span-2 space-y-6">
                {/* Configuration */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <h2 className="text-lg font-semibold mb-4">Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Location</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none"
                      >
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Variant</label>
                      <select
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none"
                      >
                        {carData.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name} - {formatPrice(variant.basePrice)}
                          </option>
                        ))}
                      </select>
                      {selectedVariantData && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-400 mb-1">Key Features</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedVariantData.features.map((f, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ex-showroom Price</span>
                      <span className="font-semibold">{formatPrice(exShowroomPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">On-road Price ({selectedLocationData?.name})</span>
                      <span className="font-bold text-orange-400 text-lg">{formatPrice(onRoadPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* EMI Calculator */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <h2 className="text-lg font-semibold mb-4">EMI Calculator</h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="mb-1 flex justify-between"><span className="text-gray-400">Loan Amount</span><span className="font-medium">{formatPrice(loanAmount)}</span></div>
                      <input type="range" min={1000000} max={Math.max(onRoadPrice, 1000000)} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between"><span className="text-gray-400">Tenure</span><span className="font-medium">{tenure} years</span></div>
                      <input type="range" min={1} max={7} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between"><span className="text-gray-400">Interest Rate</span><span className="font-medium">{interestRate}%</span></div>
                      <input type="range" min={6} max={15} step={0.1} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="rounded-lg bg-black/30 border border-white/10 p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Monthly EMI</span>
                        <span className="font-bold text-orange-400">{formatPrice(emi)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Payable</span>
                        <span className="font-bold">{formatPrice(totalPayable)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="font-semibold">{carData.averageRating}</span>
                    <span className="text-gray-400">({carData.totalReviews} reviews)</span>
                  </div>
                  <div className="space-y-4">
                    {carData.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-white/10 pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-400">by {review.reviewer}</span>
                        </div>
                        <div className="text-sm">
                          <div className="mb-1"><span className="font-medium text-green-400">Pros: </span>{review.pros.join(', ')}</div>
                          <div><span className="font-medium text-red-400">Cons: </span>{review.cons.join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0F0F10] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Book Test Drive</h3>
                <button onClick={() => setShowBooking(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <p className="text-sm text-gray-300 mb-4">We have added {carData.name} to your test drive list. Proceed to your profile to schedule, or continue browsing.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowBooking(false)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">Continue</button>
                <button onClick={() => { setShowBooking(false); window.location.href = '/profile#testdrive'; }} className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white">Go to Schedule</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
