import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [isFeelOpen, setIsFeelOpen] = useState(false);
  const interestRef = useRef<HTMLDivElement>(null);
  const feelRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <span
              className="text-2xl font-extrabold text-blue-700 tracking-tight select-none"
              style={{ letterSpacing: "0.1em" }}
            >
              KNOWN
            </span>

            {/* Interest Dropdown */}
            <div className="relative" ref={interestRef}>
              <button
                onClick={() => setIsInterestOpen((prev) => !prev)}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-150"
              >
                <span>Interest</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isInterestOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isInterestOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 py-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <a
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Buy Used Cars
                  </a>
                  <a
                    href="#sell"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Sell
                  </a>
                  <a
                    href="#best-review"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Best Review
                  </a>
                  <a
                    href="#news"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    News
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Feel Dropdown */}
            <div className="relative" ref={feelRef}>
              <button
                onClick={() => setIsFeelOpen((prev) => !prev)}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-150"
              >
                <span>Feel</span>
                <svg
                  className={`w-12 h-4 transition-transform ${
                    isFeelOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isFeelOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 py-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="block px-4 py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
                    Performance
                  </div>
                  <div className="block px-4 py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
                    Luxury
                  </div>
                  <div className="block px-4 py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
                    Off-Roading
                  </div>
                  <div className="block px-4 py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
                    Daily Drive
                  </div>
                  <div className="block px-4 py-2 text-gray-700 hover:text-blue-600 cursor-pointer">
                    Electric
                  </div>
                </div>
              )}
            </div>

           <Link to="/auth">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" >
              Login/Signup
            </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
