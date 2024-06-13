import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('department');
  const [department, setDepartment] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, userType, department }),
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

  const handleOtpVerification = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      const data = await response.json();
      alert(data.message); // Notify the user about successful OTP verification
      navigate(`/login/${userType}`); // Redirect to the appropriate login page based on user type
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={otpSent ? handleOtpVerification : handleSignup}>
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        {!otpSent && (
          <>
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
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Maintenance">Maintenance</option>
                  {/* Add other departments as needed */}
                </select>
              </div>
            )}
          </>
        )}
        {otpSent && (
          <div className="input-group">
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit" className="login-button">{otpSent ? 'Verify OTP' : 'Sign Up'}</button>
      </form>
    </div>
  );
}

export default SignupPage;
