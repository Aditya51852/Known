import { useState } from 'react';

interface Car {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  location: string;
}

interface CarCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CarCart({ isOpen, onClose }: CarCartProps) {
  const [cartItems, setCartItems] = useState<Car[]>([
    {
      id: '1',
      name: 'BMW X3',
      brand: 'BMW',
      price: '₹55,00,000',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'Audi Q5',
      brand: 'Audi',
      price: '₹58,00,000',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop',
      location: 'Delhi, NCR'
    }
  ]);

  const testDrivePrice = 399;
  const totalAmount = cartItems.length * testDrivePrice;

  const removeFromCart = (carId: string) => {
    setCartItems(prev => prev.filter(car => car.id !== carId));
  };

  const proceedToBooking = () => {
    // Handle booking logic here
    alert(`Booking ${cartItems.length} test drives for ₹${totalAmount}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">🚗</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Test Drive Cart</h2>
              <p className="text-sm text-gray-500">Home test drives at ₹399 each</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🚗</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add cars to book home test drives</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((car) => (
                <div key={car.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{car.name}</h3>
                    <p className="text-sm text-gray-500">{car.brand}</p>
                    <p className="text-sm text-gray-600 mt-1">📍 {car.location}</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">Test Drive: ₹{testDrivePrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{car.price}</p>
                    <button
                      onClick={() => removeFromCart(car.id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Test Drives: {cartItems.length}</p>
                <p className="text-lg font-bold text-gray-900">Total Amount: ₹{totalAmount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Home delivery included</p>
                <p className="text-xs text-green-600">✓ Professional driver</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={proceedToBooking}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>🏠</span>
                Book Test Drives
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 text-sm">ℹ️</span>
                <div className="text-xs text-blue-700">
                  <p className="font-medium">What's included:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Professional driver brings car to your location</li>
                    <li>• 30-minute test drive session</li>
                    <li>• Expert consultation about the vehicle</li>
                    <li>• Flexible scheduling (7 days a week)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
