import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHeart, faHandshake } from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About GiftLink</h1>
      </header>
      <main className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>At GiftLink, we believe in the power of thoughtful gifting. Our mission is to connect people through meaningful presents, making every occasion special and memorable.</p>
        </section>
        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <FontAwesomeIcon icon={faGift} className="value-icon" />
              <h3>Thoughtfulness</h3>
              <p>We curate gifts that show you care.</p>
            </div>
            <div className="value-item">
              <FontAwesomeIcon icon={faHeart} className="value-icon" />
              <h3>Connection</h3>
              <p>We bring people closer through gifting.</p>
            </div>
            <div className="value-item">
              <FontAwesomeIcon icon={faHandshake} className="value-icon" />
              <h3>Quality</h3>
              <p>We ensure every gift meets high standards.</p>
            </div>
          </div>
        </section>
        <section className="about-section">
          <h2>Our Story</h2>
          <p>Founded in 2023, GiftLink started with a simple idea: to make gifting easier and more meaningful. Since then, we've helped thousands of people find the perfect gifts for their loved ones.</p>
        </section>
      </main>
    </div>
  );
}