import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function FindTheMatch() {
  const [showBudget, setShowBudget] = useState(false);
  const navigate = useNavigate();
  const priceRanges = [
    '5-10 lakh',
    '7-13 lakh',
    '10-15 lakh',
    '13-17 lakh',
    '15-20 lakh',
    '20-25 lakh',
    '25-30 lakh',
    '30-35 lakh',
    '35-40 lakh',
    '40-45 lakh',
    '45-50 lakh',
  ];
  return (
    <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
      {/* Horizontal Options */}
      <div className="bg-white rounded-2xl p-10 shadow-lg flex flex-col items-center w-full lg:w-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Find the Match</h2>
        <div className="flex flex-row gap-6">
          <button
            className="bg-gray-100 text-gray-700 px-10 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            onClick={() => setShowBudget((v) => !v)}
          >
            By Budget
          </button>
          <button
            className="bg-gray-100 text-gray-700 px-10 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/custom-match')}
          >
            Custom
          </button>
        </div>
        {/* Budget Dropdown/Modal */}
        {showBudget && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex flex-wrap gap-3 z-50">
            {priceRanges.map((range) => (
              <button key={range} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium">
                {range}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Right Column - Image Carousel (unchanged) */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg relative w-full lg:w-auto">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1100&h=400&fit=crop" 
          alt="City street scene" 
          className="w-full h-80 object-cover"
        />
        {/* Carousel Navigation */}
        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
} 