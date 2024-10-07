import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <FontAwesomeIcon icon={faGift} className="gift-icon" />
                <span>GiftLink</span>
            </Link>
            <div className="navbar-links">
                <Link to="/app">Shop</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                {isLoggedIn ? (
                    <Link to="/profile">My Profile</Link>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}
