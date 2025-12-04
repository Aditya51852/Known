import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export function PhoneOtpLogin() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

    useEffect(() => {
        // Initialize invisible reCAPTCHA on component mount
        const initRecaptcha = () => {
            try {
                // Clear any existing recaptcha widget first
                const container = document.getElementById('recaptcha-container');
                if (container) {
                    container.innerHTML = '';
                }

                const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                    callback: () => {
                        console.log('reCAPTCHA solved successfully');
                    },
                    'expired-callback': () => {
                        console.error('reCAPTCHA expired');
                        setError('reCAPTCHA expired. Please try again.');
                    }
                });
                
                console.log('RecaptchaVerifier initialized successfully');
                setRecaptchaVerifier(verifier);
            } catch (err: any) {
                console.error('Error initializing reCAPTCHA:', err);
                setError('Failed to initialize reCAPTCHA. Please refresh the page.');
            }
        };

        if (!recaptchaVerifier) {
            initRecaptcha();
        }

        // Cleanup
        return () => {
            if (recaptchaVerifier) {
                try {
                    recaptchaVerifier.clear();
                } catch (err) {
                    console.error('Error clearing recaptcha:', err);
                }
            }
        };
    }, [recaptchaVerifier]);

    const handleSendOtp = async () => {
        setError('');
        setMessage('');

        if (!phoneNumber || phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        if (loading) return; // Prevent multiple clicks

        try {
            setLoading(true);
            const fullPhoneNumber = `+91${phoneNumber}`;
            console.log('Attempting to send OTP to:', fullPhoneNumber);

            if (!recaptchaVerifier) {
                throw new Error('reCAPTCHA not initialized');
            }

            console.log('Calling signInWithPhoneNumber...');
            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);
            console.log('OTP sent successfully, confirmation result:', result);
            
            setConfirmationResult(result);
            setOtpSent(true);
            setMessage('OTP sent successfully! Check your phone.');
        } catch (err: any) {
            console.error('Error sending OTP:', err);
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
            
            if (err.code === 'auth/invalid-phone-number') {
                setError('Invalid phone number format');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please try again later.');
            } else if (err.code === 'auth/quota-exceeded') {
                setError('SMS quota exceeded. Please try again later.');
            } else if (err.code === 'auth/captcha-check-failed') {
                setError('reCAPTCHA verification failed. Please refresh and try again.');
            } else {
                setError(`Error: ${err.message || 'Something went wrong. Please try again.'}`);
            }

            // Reset reCAPTCHA on error
            if (recaptchaVerifier) {
                try {
                    recaptchaVerifier.clear();
                    const container = document.getElementById('recaptcha-container');
                    if (container) {
                        container.innerHTML = '';
                    }
                    const newVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        size: 'invisible',
                    });
                    setRecaptchaVerifier(newVerifier);
                } catch (resetErr) {
                    console.error('Error resetting reCAPTCHA:', resetErr);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        setMessage('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        if (loading || !confirmationResult) return; // Prevent multiple clicks

        try {
            setLoading(true);
            const result = await confirmationResult.confirm(otp);
            const user = result.user;

            console.log('User logged in successfully:', user);

            // Store user data in localStorage (consistent with existing flow)
            localStorage.setItem('userName', user.displayName || user.phoneNumber || 'User');
            localStorage.setItem('userEmail', user.email || user.phoneNumber || '');
            localStorage.setItem('userPhone', user.phoneNumber || '');
            localStorage.setItem('isAuthenticated', 'true');

            // Trigger auth-changed event
            window.dispatchEvent(new Event('auth-changed'));

            setMessage('Login successful! Redirecting...');

            // Redirect to profile page
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (err: any) {
            console.error('Error verifying OTP:', err);
            if (err.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP. Please try again.');
            } else if (err.code === 'auth/code-expired') {
                setError('OTP expired. Please request a new one.');
            } else {
                setError('Verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setOtpSent(false);
        setOtp('');
        setMessage('');
        setError('');
        setConfirmationResult(null);
    };

    return (
        <div className="space-y-4">
            {/* reCAPTCHA container (invisible) */}
            <div id="recaptcha-container"></div>

            {/* Success Message */}
            {message && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                    {message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                </div>
            )}

            {!otpSent ? (
                <>
                    {/* Phone Number Input */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <div className="flex items-stretch rounded-full border border-white/10 bg-gray-800 overflow-hidden">
                            <span className="px-4 py-3 text-gray-200 text-sm select-none border-r border-white/10">
                                +91
                            </span>
                            <input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                                placeholder="10-digit mobile number"
                                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 outline-none"
                                maxLength={10}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Send OTP Button */}
                    <button
                        onClick={handleSendOtp}
                        disabled={loading || phoneNumber.length !== 10}
                        className={`w-full h-12 rounded-full font-medium transition shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] ${!loading && phoneNumber.length === 10
                                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </>
            ) : (
                <>
                    {/* OTP Input */}
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                            placeholder="6-digit OTP"
                            className="w-full px-4 py-3 rounded-full bg-gray-800 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-teal-500"
                            maxLength={6}
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            OTP sent to +91{phoneNumber}
                        </p>
                    </div>

                    {/* Verify OTP Button */}
                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading || otp.length !== 6}
                        className={`w-full h-12 rounded-full font-medium transition shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] ${!loading && otp.length === 6
                                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="w-full h-10 rounded-full font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition"
                    >
                        ← Use different number
                    </button>
                </>
            )}
        </div>
    );
}
