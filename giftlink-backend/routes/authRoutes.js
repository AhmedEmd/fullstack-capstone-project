const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'giftdb';

// Remove the duplicate authMiddleware declaration

// Register route
router.post('/register', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { firstName, lastName, email, password } = req.body;

    console.log('Received registration data:', { firstName, lastName, email, password: '****' });

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
      { expiresIn: '60m' }
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
    console.log('User ID from token:', req.user._id);
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user._id) }
    );
    
    console.log('User found:', user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile route
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { firstName, lastName } = req.body;
    const userId = req.user._id;

    console.log('Updating profile for user:', userId);
    console.log('Update data:', { firstName, lastName });

    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the profile' });
    }

    // Fetch the updated user profile
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password from the result
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;