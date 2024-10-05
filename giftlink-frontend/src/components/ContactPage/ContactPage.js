import React from 'react';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      <section>
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you! Whether you have a question about our services, need assistance with an order, or just want to say hello, feel free to reach out to us.</p>
      </section>
      <section>
        <h2>Send Us a Message</h2>
        <form className={styles.contactForm}>
          <input type="text" placeholder="Your Name" className={styles.input} required />
          <input type="email" placeholder="Your Email" className={styles.input} required />
          <textarea placeholder="Your Message" className={styles.textarea} required></textarea>
          <button type="submit" className={styles.submitButton}>Send Message</button>
        </form>
      </section>
      <section>
        <h2>Other Ways to Reach Us</h2>
        <p>Email: support@giftlink.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 123 Gift Street, Present City, GL 12345</p>
      </section>
    </div>
  );
}