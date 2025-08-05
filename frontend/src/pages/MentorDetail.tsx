import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MentorDetail() {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);

  // Mock mentor data - in real app, fetch based on mentorId
  const mentor = {
    id: 'sarah-chen',
    name: 'Dr. Sarah Chen',
    initials: 'DSC',
    rating: 4.9,
    clients: '150+',
    experience: '5+',
    about: 'Expert in automotive technology and sustainable transportation solutions',
    verified: true,
    certified: true,
    backgroundVerified: true,
    status: 'Available'
  };

  const mentorPlan = {
    id: 'premium',
    name: 'Premium Car Mentor',
    price: 1000,
    period: 'session',
    description: 'Complete car buying guidance with expert mentor support',
    features: [
      'Personalized car recommendations',
      'Market analysis & price insights',
      'Dealer negotiation support',
      'Documentation assistance',
      'Financing & insurance guidance',
      'Test drive coordination',
      'Post-purchase support',
      '24/7 chat support'
    ],
    duration: '60-90 minutes',
    availability: 'Available now'
  };

  const handleBookNow = () => {
    setIsBooking(true);
    // Navigate to chat with mentor
    navigate(`/mentor-chat/${mentor.id}?plan=${mentorPlan.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Mentor Profile */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="mb-6">
              <Link 
                to="/mentor-selection" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Mentor Selection
              </Link>
            </div>
            
            <div className="text-center mb-8">
              {/* Mentor Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                  {mentor.initials}
                </div>
                {mentor.status === 'Available' && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Mentor Info */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
              
              {/* Stats */}
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {mentor.rating}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {mentor.clients} clients
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {mentor.experience} years exp.
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{mentor.about}</p>
              
              {/* Verification Badges */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified automotive expert
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Industry certified professional
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Background verified
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Mentor Plan */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Book Your Mentor</h2>
            <p className="text-gray-500 mb-8">Get expert guidance for your car buying journey</p>
            
            <div className="border-2 border-blue-500 bg-blue-50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">{mentorPlan.name}</h3>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {mentorPlan.availability}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">₹{mentorPlan.price}</span>
                  <span className="text-gray-500 ml-1">/{mentorPlan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{mentorPlan.description}</p>
                <p className="text-sm text-blue-600 mt-1 font-medium">Duration: {mentorPlan.duration}</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                {mentorPlan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleBookNow}
                disabled={isBooking}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </>
                ) : (
                  <>
                    <span>🚗</span>
                    Book Now - ₹{mentorPlan.price}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
