const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'giftdb';

// Add this middleware function
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { firstName, lastName, email, password } = req.body;

    console.log('Received registration data:', { firstName, lastName, email, password: '****' }); // Add this line

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    // Create and assign a token
    const token = jwt.sign({ _id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email, password } = req.body;

    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and assign a token
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '60m' } // Changed to 60 minutes
    );
    res.json({ token, user: { _id: user._id, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Profile route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: req.user._id });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;