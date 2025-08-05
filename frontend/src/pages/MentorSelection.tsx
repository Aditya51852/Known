import { Link } from 'react-router-dom';

export default function MentorSelection() {
  const mentors = [
    {
      id: 'sarah-chen',
      name: 'Dr. Sarah Chen',
      initials: 'DSC',
      expertise: 'Expert in automotive technology and sustainable transportation solutions',
      rating: 4.9,
      clients: '150+',
      experience: '5+',
      hourlyRate: 200,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 'michael-rodriguez',
      name: 'Prof. Michael Rodriguez',
      initials: 'MR',
      expertise: 'Specializes in electric vehicles and automotive engineering innovations',
      rating: 4.8,
      clients: '120+',
      experience: '8+',
      hourlyRate: 180,
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 'emily-watson',
      name: 'Dr. Emily Watson',
      initials: 'EW',
      expertise: 'Car buying consultant with 15+ years of industry experience',
      rating: 4.7,
      clients: '200+',
      experience: '15+',
      hourlyRate: 150,
      avatar: '/api/placeholder/60/60'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="mb-6">
              <Link 
                to="/profile" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Profile
              </Link>
            </div>
            
            <div className="text-center">
              {/* Profile Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                  JD
                </div>
              </div>
              
              {/* Profile Info */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-500 mb-6">Looking for a mentor</p>
              
              {/* Contact Info */}
              <div className="flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                john.doe@gmail.com
              </div>
            </div>
          </div>

          {/* Right Side - Available Mentors */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Available Mentors</h2>
            <p className="text-gray-500 mb-8">Choose a mentor to guide you through your car buying journey</p>
            
            <div className="space-y-6">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Mentor Avatar */}
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                        {mentor.initials}
                      </div>
                      
                      {/* Mentor Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{mentor.expertise}</p>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
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
                        
                        <p className="text-sm text-gray-500 mb-4">Starting from ₹{mentor.hourlyRate}/hour</p>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <Link
                      to={`/mentor-detail/${mentor.id}`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
