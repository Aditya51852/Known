import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false
  );
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState('');
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [isFeelOpen, setIsFeelOpen] = useState(false);
  const interestRef = useRef<HTMLDivElement>(null);
  const feelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onStorage = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      setUserName(localStorage.getItem('userName') || '');
      setUserProfilePic(localStorage.getItem('userProfilePic') || '');
    };
    onStorage(); // Load initial values
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-changed', onStorage as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-changed', onStorage as EventListener);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        interestRef.current &&
        !interestRef.current.contains(event.target as Node)
      ) {
        setIsInterestOpen(false);
      }
      if (
        feelRef.current &&
        !feelRef.current.contains(event.target as Node)
      ) {
        setIsFeelOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfilePic');
    navigate('/login');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth-changed'));
  };

  const interestOptions = [
    'Performance', 'Luxury', 'Economy', 'Adventure', 'City Driving'
  ];

  const feelOptions = [
    'Sporty', 'Comfortable', 'Luxurious', 'Rugged', 'Elegant'
  ];

  const getUserInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 md:px-8 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Left: Brand + Interest Dropdown */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                K
              </div>
              <div className="leading-tight">
                <div className="text-base md:text-lg font-extrabold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors">
                  KNOWN
                </div>
                <div className="hidden md:block text-[10px] text-gray-500 -mt-0.5">Car Journey Platform</div>
              </div>
            </Link>

            {/* Interest Dropdown */}
            <div className="relative" ref={interestRef}>
              <button
                onClick={() => setIsInterestOpen(!isInterestOpen)}
                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Interest
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isInterestOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {interestOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        navigate('/custom-match');
                        setIsInterestOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Feel Dropdown + Auth */}
          <div className="flex items-center gap-3">
            {/* Feel Dropdown */}
            <div className="relative" ref={feelRef}>
              <button
                onClick={() => setIsFeelOpen(!isFeelOpen)}
                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Feel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isFeelOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {feelOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        navigate('/custom-match');
                        setIsFeelOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
              >
                {userProfilePic ? (
                  <img src={userProfilePic} alt={userName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    {getUserInitial()}
                  </div>
                )}
                Profile
              </Link>
            )}

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
