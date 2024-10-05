import React from 'react';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <h1>About GiftLink</h1>
      <section>
        <h2>Our Story</h2>
        <p>GiftLink was founded in 2024 with a simple mission: to make gift-giving a joyful and meaningful experience for everyone. We believe that the perfect gift has the power to strengthen relationships and create lasting memories.</p>
      </section>
      <section>
        <h2>Our Mission</h2>
        <p>At GiftLink, we're committed to:</p>
        <ul className={styles.missionList}>
          <li>Curating a diverse selection of high-quality gifts</li>
          <li>Providing exceptional customer service</li>
          <li>Simplifying the gift-giving process</li>
          <li>Supporting local artisans and sustainable practices</li>
        </ul>
      </section>
      <section>
        <h2>Our Team</h2>
        <p>We're a passionate group of gift enthusiasts, tech experts, and customer service professionals. Our diverse team brings together years of experience in e-commerce, product curation, and customer satisfaction.</p>
      </section>
      <section>
        <h2>Connect With Us</h2>
        <p>We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.</p>
        <p>Email: info@giftlink.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 123 Gift Street, Present City, GL 12345</p>
      </section>
    </div>
  );
}