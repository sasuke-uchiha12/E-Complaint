import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const { userType } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [otpSent, setOtpSent] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log('Login attempt with:', { email, password });

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            const data = await response.json();
            console.log('Login response:', data);
            if (data.message === 'OTP sent to email') {
                setOtpSent(true);
            } else {
                localStorage.setItem('token', data.token); // Store token in local storage
                navigate(`/dashboard/${userType}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        }
    };

    const handleOtpVerification = async (event) => {
        event.preventDefault();
        console.log('OTP verification attempt with:', { email, otp });

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Store token in local storage
            navigate(`/dashboard/${userType}`);
        } catch (error) {
            console.error('OTP verification error:', error);
            setError(error.message);
        }
    };

    const title = userType ? `Login (${userType.charAt(0).toUpperCase() + userType.slice(1)})` : 'Login';

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={otpSent ? handleOtpVerification : handleLogin}>
                <h2>{title}</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {!otpSent && (
                    <div className="input-group">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                )}
                {otpSent && (
                    <div className="input-group">
                        <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    </div>
                )}
                <button type="submit" className="login-button">{otpSent ? 'Verify OTP' : 'Sign In'}</button>
                <div className="extra-links">
                    <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
                    <span onClick={() => navigate('/signup')}>Sign Up</span>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
