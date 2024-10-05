import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlConfig } from '../../config';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful, token:', data.token);
      localStorage.setItem('token', data.token);
      navigate('/app');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.loginPage}>
      <h1>Login</h1>
      <div className={styles.container}>
        <p>Welcome back! Please login to your account.</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.btnPrimary}>Login</button>
        </form>
        <p className={styles.registerLink}>
          Not registered? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}