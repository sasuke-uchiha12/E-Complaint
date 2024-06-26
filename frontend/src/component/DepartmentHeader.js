import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../css/DashHeader.css';

const DepartmentHeader = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login/department');
    };

    return (
        <div className="header-container">
            <div className="header-logo">Dashboard</div>
            <ul className="header-nav">
                <li className="header-nav-item">Home</li>
                <li className="header-nav-item">View Complaints</li>
                <li className="header-nav-item">Reports</li>
                <li className="header-nav-item">Settings</li>
            </ul>
            <div className="header-user-section" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faUserCircle} size="2x" className="header-user-avatar" />
                <div className="header-user-name">{username}</div>
                <FontAwesomeIcon icon={faCaretDown} className="header-user-dropdown" />
                {dropdownVisible && (
                    <div className="header-dropdown-menu">
                        <div className="header-dropdown-item">Profile</div>
                        <div className="header-dropdown-item" onClick={handleLogout}>Logout</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DepartmentHeader;
