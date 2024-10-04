import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faShoppingCart, faTruck, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="header">
        <Link className="logo" to="/">
          <FontAwesomeIcon icon={faGift} className="gift-icon" />
          <span className="logo-text">GiftLink</span>
        </Link>
        <nav className="nav">
          <Link to="/app">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>
      <main className="main-content">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Find the Perfect Gift, Every Time</h1>
              <p>Discover unique and thoughtful gifts for every occasion. Shop now and make someone's day!</p>
              <div className="cta-buttons">
                <Link to="/app" className="btn btn-primary">Shop Now</Link>
                <Link to="/learn-more" className="btn btn-secondary">Learn More</Link>
              </div>
            </div>
          </div>
        </section>
        <section className="featured-products">
          <div className="container">
            <h2>Featured Products</h2>
            <div className="product-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-card">
                  <div className="product-image"></div>
                  <div className="product-info">
                    <h3>Amazing Gift {i}</h3>
                    <p>A perfect gift for any occasion</p>
                    <div className="product-footer">
                      <span className="price">$29.99</span>
                      <button className="btn btn-small">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="features">
          <div className="container">
            <h2>Why Choose GiftLink?</h2>
            <div className="feature-grid">
              <div className="feature">
                <FontAwesomeIcon icon={faShoppingCart} className="feature-icon" />
                <h3>Wide Selection</h3>
                <p>Thousands of unique gifts for every taste and budget</p>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faTruck} className="feature-icon" />
                <h3>Fast Delivery</h3>
                <p>Quick and reliable shipping to your doorstep</p>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCreditCard} className="feature-icon" />
                <h3>Secure Payments</h3>
                <p>Safe and encrypted transactions for your peace of mind</p>
              </div>
            </div>
          </div>
        </section>
        <section className="newsletter">
          <div className="container">
            <h2>Join Our Newsletter</h2>
            <p>Stay updated with our latest products and exclusive offers!</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 GiftLink. All rights reserved.</p>
          <nav>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}