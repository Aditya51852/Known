import React, { useState } from 'react';

interface TestDriveRequest {
  id: string;
  clientName: string;
  carModel: string;
  carBrand: string;
  location: string;
  preferredTime: string;
  duration: string;
  amount: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
}

interface ServiceProvider {
  name: string;
  email: string;
  phone: string;
  aadharCard: string;
  panCard: string;
  points: number;
  totalServices: number;
  rating: number;
  isKycComplete: boolean;
}

export default function ServiceDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'profile' | 'kyc'>('requests');
  
  // Mock data - replace with actual API calls
  const [serviceProvider] = useState<ServiceProvider>({
    name: 'Rahul Singh',
    email: 'rahul.singh@gmail.com',
    phone: '+91 9876543210',
    aadharCard: '1234-5678-9012',
    panCard: 'ABCDE1234F',
    points: 85,
    totalServices: 156,
    rating: 4.7,
    isKycComplete: true
  });

  const [testDriveRequests] = useState<TestDriveRequest[]>([
    {
      id: '1',
      clientName: 'Arjun Sharma',
      carModel: 'BMW 3 Series 320i',
      carBrand: 'BMW',
      location: 'Bandra West, Mumbai',
      preferredTime: '2024-01-16 10:00 AM',
      duration: '30 minutes',
      amount: 450,
      status: 'pending'
    }
  ]);

  const [activeServices] = useState<TestDriveRequest[]>([
    {
      id: '2',
      clientName: 'Priya Patel',
      carModel: 'Audi A4 Premium',
      carBrand: 'Audi',
      location: 'Andheri East, Mumbai',
      preferredTime: '2024-01-16 2:00 PM',
      duration: '45 minutes',
      amount: 450,
      status: 'accepted'
    }
  ]);

  const [completedServices] = useState<TestDriveRequest[]>([
    {
      id: '3',
      clientName: 'Vikram Singh',
      carModel: 'Mercedes C-Class C200',
      carBrand: 'Mercedes',
      location: 'Powai, Mumbai',
      preferredTime: '2024-01-15 11:00 AM',
      duration: '30 minutes',
      amount: 450,
      status: 'completed'
    }
  ]);

  const handleAcceptRequest = (requestId: string) => {
    // Handle accept request logic
    console.log('Accepting request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // Handle reject request logic
    console.log('Rejecting request:', requestId);
  };

  const getStatusColor = (status: TestDriveRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const thresholdPoints = 50;
  const isAboveThreshold = serviceProvider.points >= thresholdPoints;

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Provider Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {serviceProvider.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{serviceProvider.points}</div>
                  <div className="text-sm text-gray-500">Trust Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{serviceProvider.totalServices}</div>
                  <div className="text-sm text-gray-500">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{serviceProvider.rating}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Warning if below threshold */}
          {!isAboveThreshold && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-red-800 font-semibold">Warning: Low Trust Points</h3>
                  <p className="text-red-700 text-sm">Your trust points ({serviceProvider.points}) are below the threshold ({thresholdPoints}). Please maintain good service quality to avoid disqualification.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'requests', label: 'Test Drive Requests', icon: '🚗' },
                { id: 'profile', label: 'Profile Settings', icon: '👤' },
                { id: 'kyc', label: 'KYC Details', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Test Drive Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Available Test Drive Requests</h2>
                {testDriveRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests available</h3>
                    <p className="text-gray-500">Check back later for new test drive requests in your area.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testDriveRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">{request.carBrand} {request.carModel}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Client</p>
                                <p className="font-medium">{request.clientName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{request.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Preferred Time</p>
                                <p className="font-medium">{request.preferredTime}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium">{request.duration}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-green-600">₹{request.amount}</div>
                              {request.status === 'pending' && (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => handleRejectRequest(request.id)}
                                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAcceptRequest(request.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Accept Request
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={serviceProvider.name}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={serviceProvider.email}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={serviceProvider.phone}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KYC Details Tab */}
            {activeTab === 'kyc' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">KYC Details</h2>
                <div className="max-w-2xl">
                  {serviceProvider.isKycComplete ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h3 className="text-green-800 font-semibold">KYC Verification Complete</h3>
                          <p className="text-green-700 text-sm">Your identity has been verified successfully.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h3 className="text-yellow-800 font-semibold">KYC Verification Pending</h3>
                          <p className="text-yellow-700 text-sm">Please complete your KYC verification to start accepting requests.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card Number</label>
                      <input
                        type="text"
                        value={serviceProvider.aadharCard}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Number</label>
                      <input
                        type="text"
                        value={serviceProvider.panCard}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
