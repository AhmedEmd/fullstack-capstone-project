import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';
import './Navbar.css';

function Navbar() {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <nav className={`navbar navbar-expand-lg ${isLandingPage ? 'navbar-landing' : 'navbar-default'}`}>
            <Link className="navbar-brand" to="/">GiftLink</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact</Link>
                    </li>
                    {isAuthenticated ? (
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">My Profile</Link>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
