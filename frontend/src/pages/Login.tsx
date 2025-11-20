 import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { authApi } from '../services/api';

const Login = () => {
  // New Figma-aligned implementation
  // Kept self-contained and minimal dependencies
  // Adds: random hero image, Google sign-in, phone OTP modal

  const images = [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
  ];

  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<'client' | 'dealer' | 'service_provider' | 'mentor'>('client');

  const heroImage = useMemo(() => images[Math.floor(Math.random() * images.length)], []);

  useEffect(() => {
    // If this page is reached with role=dealer, redirect to dedicated dealer login
    const r = sp.get('role');
    if (r === 'dealer') {
      navigate('/dealer/login', { replace: true });
      return;
    }
    if (showOtp) {
      const el = document.getElementById("otp-0") as HTMLInputElement | null;
      el?.focus();
    }
  }, [showOtp, sp, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      // In production, pass idToken from Google SDK.
      // Dev mode: backend accepts email + googleId when GOOGLE_OAUTH_DEV=true
      const devPayload = {
        email: `user${Math.floor(Math.random()*100000)}@example.com`,
        googleId: `dev-${Date.now()}`,
        name: undefined as unknown as string,
        role,
      };
      const result = await authApi.googleSignIn(devPayload);
      window.dispatchEvent(new Event('auth-changed'));
      if (result.user?.profileComplete) {
        navigate("/profile");
      } else {
        navigate("/profile-setup");
      }
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithMobile = async () => {
    try {
      setError("");
      if (mobileNumber.trim().length !== 10) return;
      setLoading(true);
      await authApi.sendOtp(mobileNumber);
      setShowOtp(true);
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete) return;
    setShowOtp(false);
    try {
      setLoading(true);
      const code = otp.join("");
      const result = await authApi.verifyOtp(mobileNumber, code, role);
      window.dispatchEvent(new Event('auth-changed'));
      if (result.user?.profileComplete) {
        navigate("/profile");
      } else {
        navigate("/profile-setup");
      }
    } catch (e: any) {
      setError(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((d: string) => d.length === 1);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) {
      const el = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column */}
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl sm:text-5xl font-semibold">Let's connect as a family</h1>
            <div className="relative w-80 h-64 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img src={heroImage} alt="Handshake" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <p className="text-gray-300 text-lg">Building connections, one handshake at a time</p>
          </div>

          {/* Right Column */}
          <div className="bg-gray-900/50 rounded-2xl p-8 ring-1 ring-white/10 max-w-md w-full mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white text-sm mb-4">
              <span className="mr-2">←</span> Back to Homepage
            </Link>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Welcome to Known</h2>
              <p className="text-gray-400">Login with Google or Mobile OTP</p>
            </div>

            {/* Role Selection */}
            <div className="mb-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setRole('client')}
                className={`h-10 rounded-lg text-sm font-medium ${role === 'client' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >Client</button>
              <button
                onClick={() => navigate('/dealer/login')}
                className={`h-10 rounded-lg text-sm font-medium ${role === 'dealer' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >Dealer</button>
              <button
                onClick={() => setRole('service_provider')}
                className={`h-10 rounded-lg text-sm font-medium ${role === 'service_provider' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >Service Provider</button>
              <button
                onClick={() => setRole('mentor')}
                className={`h-10 rounded-lg text-sm font-medium ${role === 'mentor' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >Mentor</button>
            </div>

            {/* Quick Client Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium transition-transform duration-200 active:scale-[0.99] shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" opacity=".8" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" opacity=".7" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" opacity=".6" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Mobile OTP Login */}
            <div className="space-y-3">
              <div className="flex items-stretch rounded-full border border-white/10 bg-gray-800 overflow-hidden">
                <span className="px-4 py-3 text-gray-200 text-sm select-none border-r border-white/10">+91</span>
                <input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                  type="tel"
                  placeholder="Mobile Number"
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 outline-none"
                  maxLength={10}
                />
              </div>
              <button
                onClick={handleContinueWithMobile}
                disabled={loading || mobileNumber.length !== 10}
                className={`w-full h-12 rounded-full font-medium transition shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] ${
                  !loading && mobileNumber.length === 10
                    ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-400">By continuing, you agree to our Terms & Privacy Policy.</div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowOtp(false)} />
          <div className="relative z-10 w-full max-w-md bg-gray-900 rounded-xl p-6 ring-1 ring-white/10">
            <h3 className="text-lg font-semibold mb-1">Enter OTP</h3>
            <p className="text-sm text-gray-400 mb-6">We sent a 4-digit code to +91{mobileNumber}</p>
            <div className="flex items-center justify-center gap-3 mb-6">
              {otp.map((d: string, i: number) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-12 text-center text-lg rounded-lg bg-gray-800 text-white border border-white/10 focus:border-teal-500 outline-none"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || loading}
              className={`w-full h-11 rounded-lg font-medium ${isOtpComplete && !loading ? 'bg-teal-600 hover:bg-teal-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;