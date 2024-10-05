import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faShoppingCart, faTruck, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <Link className={styles.logo} to="/">
          <FontAwesomeIcon icon={faGift} className={styles.giftIcon} />
          <span className={styles.logoText}>GiftLink</span>
        </Link>
        <nav className={styles.nav}>
          <Link className={styles.navLink} to="/app">Shop</Link>
          <Link className={styles.navLink} to="/about">About</Link>
          <Link className={styles.navLink} to="/contact">Contact</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Find the Perfect Gift, Every Time</h1>
              <p className={styles.heroText}>
                Discover unique and thoughtful gifts for every occasion. Shop now and make someone's day!
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/app" className={`${styles.btn} ${styles.btnPrimary}`}>Shop Now</Link>
                <Link to="/learn-more" className={`${styles.btn} ${styles.btnOutline}`}>Learn More</Link>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.featuredProducts}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <div className={styles.productGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.productCard}>
                  <div className={styles.productImage}></div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>Amazing Gift {i}</h3>
                    <p className={styles.productDescription}>A perfect gift for any occasion</p>
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>$29.99</span>
                      <button className={`${styles.btn} ${styles.btnSmall}`}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Choose GiftLink?</h2>
            <div className={styles.featureGrid}>
              <div className={styles.feature}>
                <FontAwesomeIcon icon={faShoppingCart} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>Wide Selection</h3>
                <p className={styles.featureText}>Thousands of unique gifts for every taste and budget</p>
              </div>
              <div className={styles.feature}>
                <FontAwesomeIcon icon={faTruck} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>Fast Delivery</h3>
                <p className={styles.featureText}>Quick and reliable shipping to your doorstep</p>
              </div>
              <div className={styles.feature}>
                <FontAwesomeIcon icon={faCreditCard} className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>Secure Payments</h3>
                <p className={styles.featureText}>Safe and encrypted transactions for your peace of mind</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.newsletter}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Join Our Newsletter</h2>
            <p className={styles.newsletterText}>Stay updated with our latest products and exclusive offers!</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" className={styles.input} />
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Subscribe</button>
            </form>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>&copy; 2024 GiftLink. All rights reserved.</p>
          <nav className={styles.footerNav}>
            <Link className={styles.footerLink} to="/terms">Terms of Service</Link>
            <Link className={styles.footerLink} to="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}