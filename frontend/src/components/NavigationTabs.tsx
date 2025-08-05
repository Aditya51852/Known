import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NavigationTabs() {
  const [active, setActive] = useState('Buy');
  const [showBest, setShowBest] = useState(false);
  const navigate = useNavigate();

  // Scroll helpers
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative flex space-x-8 py-4">
      {['Buy', 'Sell', 'Best Reviews', 'News'].map((tab) => (
        <button
          key={tab}
          className={
            (active === tab
              ? 'text-gray-900 font-semibold'
              : 'text-gray-600 hover:text-gray-900 font-medium') +
            ' relative pb-2 transition-colors duration-200'
          }
          onClick={() => {
            setActive(tab);
            if (tab === 'Buy') scrollToSection('buy-section');
            if (tab === 'Sell') navigate('/sell');
            if (tab === 'Best Reviews') setShowBest(true);
            if (tab === 'News') scrollToSection('news-section');
          }}
        >
          {tab}
          {/* Animated dash */}
          <span
            className={
              'absolute left-0 right-0 -bottom-1 h-1 rounded-full transition-all duration-300 ' +
              (active === tab ? 'bg-blue-600 w-full' : 'bg-transparent w-0')
            }
          />
        </button>
      ))}
      {/* Best Review Modal/Overlay */}
      {showBest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowBest(false)}>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Best Reviews</h2>
            <ul className="space-y-3">
              {/* Example reviews, replace with real data */}
              <li className="p-3 bg-gray-100 rounded">Amazing car, great value! - <span className="font-semibold">Priya</span></li>
              <li className="p-3 bg-gray-100 rounded">Smooth ride and excellent features. - <span className="font-semibold">Rahul</span></li>
              <li className="p-3 bg-gray-100 rounded">Best purchase I've made! - <span className="font-semibold">Amit</span></li>
              <li className="p-3 bg-gray-100 rounded">Highly recommend for families. - <span className="font-semibold">Sara</span></li>
              <li className="p-3 bg-gray-100 rounded">Fuel efficient and stylish. - <span className="font-semibold">Vikram</span></li>
              {/* Add more reviews as needed */}
            </ul>
            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" onClick={() => setShowBest(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 