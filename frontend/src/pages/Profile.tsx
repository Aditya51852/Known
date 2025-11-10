import { Link } from 'react-router-dom';
import { useState } from 'react';

interface TestDriveCar {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export default function Profile() {
  const [testDriveCars, setTestDriveCars] = useState<TestDriveCar[]>([]);
  const [showAddCar, setShowAddCar] = useState(false);

  const availableCars: TestDriveCar[] = [
    { id: '1', name: 'Supra GR', brand: 'Toyota', price: 450, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop' },
    { id: '2', name: 'M3', brand: 'BMW', price: 450, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop' },
    { id: '3', name: 'Mustang GT', brand: 'Ford', price: 450, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop' },
    { id: '4', name: 'Camaro SS', brand: 'Chevrolet', price: 450, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop' }
  ];

  const addCarToTestDrive = (car: TestDriveCar) => {
    if (!testDriveCars.find(c => c.id === car.id)) {
      setTestDriveCars([...testDriveCars, car]);
    }
    setShowAddCar(false);
  };

  const removeCarFromTestDrive = (carId: string) => {
    setTestDriveCars(testDriveCars.filter(car => car.id !== carId));
  };

  const calculateTotal = () => {
    const basePrice = 450;
    const totalCars = testDriveCars.length;
    
    if (totalCars >= 3) {
      // Package discount: ₹399 per car
      const discountedPrice = 399;
      const totalAmount = totalCars * discountedPrice;
      const savings = totalCars * (basePrice - discountedPrice);
      return { totalAmount, pricePerCar: discountedPrice, savings, hasDiscount: true };
    } else {
      const totalAmount = totalCars * basePrice;
      return { totalAmount, pricePerCar: basePrice, savings: 0, hasDiscount: false };
    }
  };

  const pricing = calculateTotal();
  const quickActions = [
    {
      id: 'favourite',
      title: 'Favourite',
      description: 'Shows liked cars',
      icon: '❤️',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      link: '/favourites'
    },
    {
      id: 'bargein',
      title: 'Bargein Arena',
      description: 'Get competing dealer offers privately',
      icon: '🏷️',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      link: '/bargein'
    },
    {
      id: 'compare',
      title: 'Compare',
      description: 'Saved cars to compare',
      icon: '📊',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      link: '/compare'
    },
    {
      id: 'mentor',
      title: 'Mentor Status',
      description: 'Select a mentor',
      icon: '🎓',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      link: '/mentor-selection'
    },
    {
      id: 'testdrive',
      title: 'Test Drive',
      description: 'Manage your test drive bookings',
      icon: '🚗',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
      link: '#testdrive'
    },
    {
      id: 'settings',
      title: 'Profile Settings',
      description: 'Update email, phone, location',
      icon: '⚙️',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-500',
      link: '/profile-settings'
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'Manage app permissions',
      icon: '🔒',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      link: '/permissions'
    }
  ];

  return (
  <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center">
              {/* Profile Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                  JD
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              
              {/* Profile Info */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-500 mb-6">Welcome back to Known</p>
              
              {/* Contact Info */}
              <div className="flex items-center justify-center text-gray-600 mb-8">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                john.doe@gmail.com
              </div>
            </div>
          </div>

          {/* Right Side - Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  to={action.link}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center text-xl`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Test Drive Section */}
        <div id="testdrive" className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Test Drive Cars</h2>
            <button
              onClick={() => setShowAddCar(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Car
            </button>
          </div>

          {testDriveCars.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars selected</h3>
              <p className="text-gray-500 mb-4">Add cars to your test drive list to get started.</p>
              <button
                onClick={() => setShowAddCar(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Your First Car
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {testDriveCars.map((car) => (
                  <div key={car.id} className="border border-gray-200 rounded-lg p-4">
                    <img src={car.image} alt={`${car.brand} ${car.name}`} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h3 className="font-semibold text-gray-900">{car.brand} {car.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">₹{pricing.pricePerCar} per test drive</p>
                    <button
                      onClick={() => removeCarFromTestDrive(car.id)}
                      className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pricing Summary</h3>
                  {pricing.hasDiscount && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Package Discount Applied!
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Cars selected:</span>
                    <span className="font-medium">{testDriveCars.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per car:</span>
                    <span className="font-medium">₹{pricing.pricePerCar}</span>
                  </div>
                  {pricing.hasDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>You save:</span>
                      <span className="font-medium">₹{pricing.savings}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">₹{pricing.totalAmount}</span>
                  </div>
                </div>
                
                {testDriveCars.length > 0 && (
                  <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Add Car Modal */}
          {showAddCar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Select Car for Test Drive</h3>
                  <button
                    onClick={() => setShowAddCar(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableCars.filter(car => !testDriveCars.find(c => c.id === car.id)).map((car) => (
                    <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img src={car.image} alt={`${car.brand} ${car.name}`} className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{car.brand} {car.name}</h3>
                      <p className="text-gray-600 mb-4">₹{car.price} per test drive</p>
                      <button
                        onClick={() => addCarToTestDrive(car)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add to Test Drive
                      </button>
                    </div>
                  ))}
                </div>
                
                {availableCars.filter(car => !testDriveCars.find(c => c.id === car.id)).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">All available cars have been added to your test drive list.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
