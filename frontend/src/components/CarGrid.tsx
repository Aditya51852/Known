interface Car {
  id?: string;
  name: string;
  brand?: string;
  price: string;
  image: string;
  location?: string;
}

interface CarGridProps {
  title: string;
  cars: Car[];
  showSearch?: boolean;
  onAddToCart?: (car: Car) => void;
}

import { useNavigate } from 'react-router-dom';

export function CarGrid({ title, cars, showSearch = false }: CarGridProps) {
  const navigate = useNavigate();

  const handleCarClick = (car: Car, index: number) => {
    // Use car.id if available, otherwise use index as fallback
    const carId = car.id || (index + 1).toString();
    navigate(`/car/${carId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showSearch && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Filter by brand name"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car, index) => (
          <div 
            key={car.id || index} 
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleCarClick(car, index)}
          >
            <div className="relative">
              <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg">{car.name}</h3>
              <p className="text-blue-600 font-bold text-lg mt-2">{car.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}