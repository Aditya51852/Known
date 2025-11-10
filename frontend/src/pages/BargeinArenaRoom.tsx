import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const mockOffers = [
  {
    id: 'o1', dealer: 'City Motors', exShowroom: 2250000, onRoad: 2450000, discount: 15000, delivery: '3 weeks', perks: ['Floor mats', 'Basic accessories'],
  },
  {
    id: 'o2', dealer: 'Prime Autohaus', exShowroom: 2230000, onRoad: 2395000, discount: 25000, delivery: '2 weeks', perks: ['Extended warranty (1y)', 'Seat covers'],
  },
  {
    id: 'o3', dealer: 'Auto Galaxy', exShowroom: 2240000, onRoad: 2420000, discount: 18000, delivery: '10 days', perks: ['Free first service pickup'],
  },
];

const BargeinArenaRoom: React.FC = () => {
  const { arenaId } = useParams();
  const navigate = useNavigate();

  const handleLockDealer = (dealerName: string) => {
    // TODO: Call backend to lock dealer and reveal details to that dealer.
    alert(`Dealer locked: ${dealerName}`);
    navigate(`/loan-arena/${arenaId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bargein Arena</h1>
              <p className="text-gray-500">Token: <span className="font-mono">KN-BGN-XXXX-1234</span> | Arena ID: {arenaId}</p>
              <p className="text-gray-500 text-sm mt-1">Verified dealers within 50–60 km of your location can join this arena and submit their best offers.</p>
            </div>
            <Link to="/bargein/select-car" className="text-sm text-gray-600 hover:text-gray-900">Edit Preferences</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dealer Offers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 pr-4">Dealer</th>
                  <th className="py-2 pr-4">Ex-Showroom</th>
                  <th className="py-2 pr-4">On-road</th>
                  <th className="py-2 pr-4">Discount</th>
                  <th className="py-2 pr-4">Delivery</th>
                  <th className="py-2 pr-4">Perks</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOffers.map((o) => (
                  <tr key={o.id} className="border-t text-sm">
                    <td className="py-3 pr-4 font-medium text-gray-900">{o.dealer}</td>
                    <td className="py-3 pr-4 text-gray-700">₹{o.exShowroom.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-gray-700">₹{o.onRoad.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-green-700">-₹{o.discount.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-gray-700">{o.delivery}</td>
                    <td className="py-3 pr-4 text-gray-700">{o.perks.join(', ')}</td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleLockDealer(o.dealer)}
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                      >
                        Lock Dealer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargeinArenaRoom;
