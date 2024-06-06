import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/SignupPage.css';
import axios from 'axios';


function SignupPage() {
    const navigate = useNavigate();
   // const { userType } = useParams();
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); 

    const handleSignup = (e) => {
        e.preventDefault();
        const userData = { username, name, email, phoneNumber, password, role };
        axios.post('http://localhost:3001/register', userData)
            .then(result => {
                console.log(result);
                // Handle successful signup, such as redirecting to login page
                navigate('/login');
            })
            .catch(error => {
                console.error('Error signing up:', error);
                // Handle error, such as displaying an error message to the user
            });
    }

   // const head = userType ? `Signup (${userType.charAt(0).toUpperCase() + userType.slice(1)})` : 'Signup';
    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                <h2>Signup</h2>
                <div className="input-group">
                    <input type="text" placeholder="Username" required
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                    <input type="text" placeholder="Name" required
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-group">
                    <input type="email" placeholder="Email" required
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <input type="tel" placeholder="Phone Number" required
                        onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="input-group">
                    <input type="password" placeholder="Password" required
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-group">
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="superadmin">SuperAdmin</option>
                        <option value="admin">Admin</option>
                        <option value="department">Department</option>
                    </select>
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
                <div>
                    <p>ALready Have an Account</p>
                    <Link to="/login" className="signup-button">Login</Link>
                </div>
                </form>
               

        </div>
    );
}

export default SignupPage;
