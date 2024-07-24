import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const { userType } = useParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uname: username, password })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userType', data.role);
            localStorage.setItem('department', data.department);
            navigate(`/dashboard/${data.role}`);
        } catch (error) {
            setError(error.message);
        }
    };

    const title = userType ? `Login (${userType.charAt(0).toUpperCase() + userType.slice(1)})` : 'Login';

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>{title}</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="login-button">Sign In</button>
                <div className="extra-links">
                    <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
                    <span onClick={() => navigate('/signup')}>Sign Up</span>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
