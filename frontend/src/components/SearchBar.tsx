import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SearchBarProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function SearchBar({ isExpanded, onToggleExpanded }: SearchBarProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const goToCustomMatch = (_params?: Record<string, string>) => {
    // For now, just open the custom match page. Hook up params later if needed.
    navigate('/custom-match');
  };

  return (
    <div ref={containerRef} className="w-full mt-6 relative">
      {/* Compact pill */}
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-expanded={isExpanded}
        className="w-full max-w-2xl mx-auto flex items-center justify-between rounded-2xl bg-white/95 border border-gray-200 shadow-sm hover:shadow-md transition-shadow px-4 py-3 text-left"
      >
        <div className="flex items-center text-gray-500">
          <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <span className="text-sm md:text-base text-gray-600">Find by Name / Fuel / Feel ✨</span>
        </div>
        <span className="hidden sm:block text-sm text-gray-400">Click to expand</span>
      </button>

      {/* Popup panel */}
      {isExpanded && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-full max-w-2xl z-50">
          <div className="rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 divide-y divide-gray-100">
              {/* Brand */}
              <div className="py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">Brand</h4>
                  <Link to="/#brands" className="text-sm text-blue-600 hover:underline">More brands</Link>
                </div>
                <div className="flex flex-col">
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ brand: 'BMW' })}>BMW</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ brand: 'Audi' })}>Audi</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ brand: 'Toyota' })}>Toyota</button>
                </div>
              </div>

              {/* Fuel Type */}
              <div className="py-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Fuel Type</h4>
                <div className="flex flex-col">
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ fuel: 'Petrol' })}>Petrol</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ fuel: 'Diesel' })}>Diesel</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ fuel: 'Electric' })}>Electric</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ fuel: 'Hybrid' })}>Hybrid</button>
                </div>
              </div>

              {/* Feel */}
              <div className="py-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Feel</h4>
                <div className="flex flex-col">
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ feel: 'Performance' })}>Performance</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ feel: 'Luxury' })}>Luxury</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ feel: 'Off-Roading' })}>Off-Roading</button>
                  <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => goToCustomMatch({ feel: 'Daily Drive' })}>Daily Drive</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}