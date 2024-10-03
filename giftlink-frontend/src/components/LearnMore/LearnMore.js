import React from 'react';
import './LearnMore.css';

export default function LearnMore() {
  return (
    <div className="learn-more">
      <h1>Learn More About GiftLink</h1>
      <section>
        <h2>Our Mission</h2>
        <p>At GiftLink, we believe in the power of thoughtful gifting. Our mission is to connect people through meaningful presents, making every occasion special and memorable.</p>
      </section>
      <section>
        <h2>How It Works</h2>
        <ol>
          <li>Browse our curated selection of unique gifts</li>
          <li>Choose the perfect present for your loved ones</li>
          <li>Personalize your gift with a heartfelt message</li>
          <li>We deliver your gift with care and precision</li>
        </ol>
      </section>
      <section>
        <h2>Our Commitment</h2>
        <p>We are committed to sourcing high-quality, sustainable products from ethical suppliers. Every gift in our collection is chosen with care, ensuring that you're not just giving a present, but sharing a piece of joy.</p>
      </section>
    </div>
  );
}