import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

export default function Navbar() {
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
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
}
