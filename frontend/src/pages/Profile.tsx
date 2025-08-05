import { Link } from 'react-router-dom';

export default function Profile() {
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
    <div className="min-h-screen bg-gray-50 py-8">
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
      </div>
    </div>
  );
}
