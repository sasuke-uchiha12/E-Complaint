import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [otpSent, setOtpSent] = useState(false);

    const handleForgotPassword = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            const data = await response.json();
            if (data.message === 'OTP sent to email') {
                setOtpSent(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            alert('Password reset successful. Please login with your new password.');
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={otpSent ? handleResetPassword : handleForgotPassword}>
                <h2>Forgot Password</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {otpSent && (
                    <>
                        <div className="input-group">
                            <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                    </>
                )}
                <button type="submit" className="login-button">{otpSent ? 'Reset Password' : 'Send OTP'}</button>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
