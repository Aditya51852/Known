import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false
  );
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [isFeelOpen, setIsFeelOpen] = useState(false);
  const interestRef = useRef<HTMLDivElement>(null);
  const feelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onStorage = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };
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

  const navLink = (to: string, label: string) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        {label}
      </Link>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 md:px-8 py-3">
        <div className="grid grid-cols-3 items-center w-full">
          {/* Brand */}
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

          {/* Left controls: Interest dropdown (hidden to simplify header) */}
          <div className="hidden" aria-hidden ref={interestRef}></div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-2">
            {navLink('/', 'Home')}
            {navLink('/bargein', 'Bargain Arena')}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-3">
            {/* Settings icon placeholder to match design */}
            <button
              className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label="Settings"
              ref={feelRef}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.572c-1.756-.426-1.756-2.924 0-3.35.52-.126.95-.47 1.066-.99.94-1.543 3.707-.777 2.37-2.37A1.724 1.724 0 007.752 5.383 1.724 1.724 0 0010.325 4.317z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            {isAuthenticated && (
              <Link to="/profile" className="hidden md:inline-flex px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50">
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
