import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";

const SimpleLogin = () => {
    const images = [
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    ];

    const navigate = useNavigate();
    const [sp] = useSearchParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const heroImage = useMemo(() => images[Math.floor(Math.random() * images.length)], []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !email.trim()) {
            setError("Please provide both name and email");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please provide a valid email address");
            return;
        }

        try {
            setLoading(true);

            // Store user data in localStorage
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            if (profilePic) {
                localStorage.setItem('userProfilePic', profilePic);
            }
            localStorage.setItem('isAuthenticated', 'true');

            // Trigger auth-changed event
            window.dispatchEvent(new Event('auth-changed'));

            // Redirect to the page they came from or to profile
            const returnPath = sp.get('from') || '/profile';
            navigate(returnPath);
        } catch (e: any) {
            setError(e.message || 'Login failed');
        } finally {
            setLoading(false);
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

                    {/* Right Column - Simplified Login Form */}
                    <div className="bg-gray-900/50 rounded-2xl p-8 ring-1 ring-white/10 max-w-md w-full mx-auto">
                        <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white text-sm mb-4">
                            <span className="mr-2">←</span> Back to Homepage
                        </Link>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold">Welcome to Known</h2>
                            <p className="text-gray-400">Enter your details to continue</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-full bg-gray-800 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-teal-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-full bg-gray-800 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-teal-500"
                                    required
                                />
                            </div>

                            {/* Profile Picture (Optional) */}
                            <div>
                                <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300 mb-2">
                                    Profile Picture (Optional)
                                </label>
                                <div className="flex items-center gap-4">
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile preview" className="w-16 h-16 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-4 py-2 rounded-full bg-gray-800 border border-white/10 text-gray-300 hover:bg-gray-700 transition-colors text-center">
                                            {profilePic ? 'Change Photo' : 'Upload Photo'}
                                        </div>
                                        <input
                                            id="profilePic"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full h-12 rounded-full font-medium transition shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] ${!loading
                                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white'
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? 'Logging in...' : 'Continue'}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="text-center mt-8 text-sm text-gray-400">
                            By continuing, you agree to our Terms & Privacy Policy.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleLogin;
