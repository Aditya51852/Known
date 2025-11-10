import React from 'react';
import { Link, useParams } from 'react-router-dom';

const mockLoanOffers = [
  { id: 'l1', lender: 'Bank A', roi: 9.25, tenure: '5 years', processing: '₹3,999' },
  { id: 'l2', lender: 'NBFC B', roi: 9.75, tenure: '6 years', processing: '₹2,499' },
  { id: 'l3', lender: 'Bank C', roi: 8.95, tenure: '5 years', processing: '₹4,499' },
];

const LoanArenaRoom: React.FC = () => {
  const { arenaId } = useParams();

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Arena</h1>
              <p className="text-gray-500">Token: <span className="font-mono">KN-LN-XXXX-5678</span> | Arena ID: {arenaId}</p>
            </div>
            <Link to={`/bargein/arena/${arenaId}`} className="text-sm text-gray-600 hover:text-gray-900">Back to Dealer Offers</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financing Offers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 pr-4">Lender</th>
                  <th className="py-2 pr-4">Interest (ROI)</th>
                  <th className="py-2 pr-4">Tenure</th>
                  <th className="py-2 pr-4">Processing Fee</th>
                </tr>
              </thead>
              <tbody>
                {mockLoanOffers.map((o) => (
                  <tr key={o.id} className="border-t text-sm">
                    <td className="py-3 pr-4 font-medium text-gray-900">{o.lender}</td>
                    <td className="py-3 pr-4 text-gray-700">{o.roi}%</td>
                    <td className="py-3 pr-4 text-gray-700">{o.tenure}</td>
                    <td className="py-3 pr-4 text-gray-700">{o.processing}</td>
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

export default LoanArenaRoom;
