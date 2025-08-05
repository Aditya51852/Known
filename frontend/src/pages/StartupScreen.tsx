import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const StartupScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to homepage after 2 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-extrabold text-white tracking-wider animate-pulse">
            KNOWN
          </h1>
          <p className="text-xl text-blue-100 mt-4">Your Premium Car Marketplace</p>
        </div>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};
