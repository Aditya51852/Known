import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const WelcomeSection: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Family Connection */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Let's connect as a family
            </h2>
            
            {/* Family Image */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <div className="w-80 h-64 bg-gradient-to-br from-orange-400 via-red-400 to-purple-500 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&crop=faces"
                  alt="Family hands together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <p className="text-gray-600 text-lg">
              Building connections, one handshake at a time
            </p>
          </div>

          {/* Right Side - Welcome to Known */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Known
              </h3>
              <p className="text-gray-600">
                Choose your login method
              </p>
            </div>

            {/* Quick Login Button */}
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg mb-4 flex items-center justify-center space-x-2 transition-colors">
              <span className="text-lg">G</span>
              <span>Quick Login (Client)</span>
            </button>

            <div className="text-center text-gray-500 mb-4">or</div>

            {/* Mobile Number Input */}
            <div className="mb-6">
              <div className="flex">
                <div className="flex items-center bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0 border-gray-300">
                  <span className="text-gray-700 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 px-6 rounded-lg mt-3 transition-colors">
                Continue with Mobile
              </button>
            </div>

            <div className="text-center text-gray-500 mb-6">Or choose your role</div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Link to="/login" className="block">
                <div className="flex items-center p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Login as Client</div>
                    <div className="text-sm text-gray-600">Find and test drive cars</div>
                  </div>
                </div>
              </Link>

              <Link to="/login" className="block">
                <div className="flex items-center p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Login as Dealer</div>
                    <div className="text-sm text-gray-600">Manage your showroom</div>
                  </div>
                </div>
              </Link>

              <Link to="/login" className="block">
                <div className="flex items-center p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Login as Mentor</div>
                    <div className="text-sm text-gray-600">Guide car buyers</div>
                  </div>
                </div>
              </Link>

              <Link to="/login" className="block">
                <div className="flex items-center p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Login as Service Provider</div>
                    <div className="text-sm text-gray-600">Provide test drive services</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
