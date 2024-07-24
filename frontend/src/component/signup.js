import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('department');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState(null);

    const handleSignup = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, username, phoneNumber, password, userType, department }),
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            alert('Signup successful! Please login.');
            navigate(`/login/${userType}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSignup}>
                <h2>Sign Up</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                        style={{ width: "88%" }}
                    >
                        <option value="superadmin">Superadmin</option>
                        <option value="admin">Admin</option>
                        <option value="department">Department</option>
                    </select>
                </div>
                {userType === 'department' && (
                    <div className="input-group">
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                            style={{ width: "88%" }}
                        >
                            <option value="" disabled>Select Department</option>
                            <option value="Department of Computer Science">Department of Computer Science</option>
                            <option value="Department of Mechanical Engineering">Department of Mechanical Engineering</option>
                            <option value="Department of Electrical Engineering">Department of Electrical Engineering</option>
                            <option value="Department of Civil Engineering">Department of Civil Engineering</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="login-button">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupPage;
