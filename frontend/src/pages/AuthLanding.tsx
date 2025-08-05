import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const AuthLanding: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'client' | 'dealer' | 'mentor' | null>(null);

  const roles = [
    {
      type: 'client' as const,
      title: 'Client',
      description: 'Find your perfect car with expert guidance',
      icon: '🚗',
      features: ['Browse premium cars', 'Get expert advice', 'Compare vehicles', 'Secure financing']
    },
    {
      type: 'dealer' as const,
      title: 'Dealer',
      description: 'Showcase your inventory to premium buyers',
      icon: '🏢',
      features: ['List your inventory', 'Reach premium buyers', 'Manage sales', 'Analytics dashboard']
    },
    {
      type: 'mentor' as const,
      title: 'Mentor',
      description: 'Share your expertise and earn money',
      icon: '👨‍🏫',
      features: ['Offer expert advice', 'Flexible scheduling', 'Earn ₹200-2200', 'Build reputation']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">KNOWN</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose your role to get started with our premium car marketplace
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => (
            <div
              key={role.type}
              className={`bg-white rounded-xl p-8 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedRole === role.type
                  ? 'ring-4 ring-blue-500 transform scale-105'
                  : 'hover:transform hover:scale-102'
              }`}
              onClick={() => setSelectedRole(role.type)}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
              
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {selectedRole && (
          <div className="text-center space-y-6 mt-8">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg mx-auto">
              <p className="text-gray-700 mb-4">
                Continue as <span className="font-semibold text-blue-600">{selectedRole}</span>
              </p>
              
              {/* Quick Auth Options */}
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                
                <button className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Login with Mobile OTP
                </button>
              </div>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>
              
              {/* Traditional Auth Options */}
              <div className="space-y-3">
                <Link
                  to={`/login?role=${selectedRole}`}
                  className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login with Email
                </Link>
                
                <Link
                  to={`/signup?role=${selectedRole}`}
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedRole(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Choose different role
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
