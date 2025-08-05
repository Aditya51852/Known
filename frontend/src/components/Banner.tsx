import { useNavigate } from 'react-router-dom';

export function Banner() {
  const navigate = useNavigate();
  return (
    <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden cursor-pointer group" onClick={() => navigate('/signup')}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 z-20" />
      <div className="relative z-30 h-full flex items-center justify-center text-center text-white">
        <div>
          <h1 className="text-5xl font-bold mb-4 group-hover:underline">Premium Car Membership</h1>
          <p className="text-xl mb-8 opacity-90">Discover your perfect match</p>
        </div>
      </div>
      {/* The whole banner is clickable, handled by onClick above */}
    </div>
  );
} 