const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth');
const profanityFilter = require('../utils/profanityFilter');

// Health check route to verify API is working
// router.get('/', (req, res) => {
//     res.send('Gift API is working');
// });

// Fetch all gifts
router.get('', async (req, res) => {
    try {
        // Task 2: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 3: use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Task 4: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray();

        // Task 5: return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

// Fetch a gift by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || id.trim() === '') {
            return res.status(400).json({ error: 'Invalid ID provided' });
        }

        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        let query;
        if (ObjectId.isValid(id)) {
            query = { _id: new ObjectId(id) };
        } else {
            query = { id: id };
        }

        const gift = await collection.findOne(query);

        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).json({ error: 'Error fetching gift', details: e.message });
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Get the collection
        const collection = db.collection("gifts");

        // Insert the gift
        const gift = await collection.insertOne(req.body);

        // Return the newly created gift
        res.status(201).json(gift.ops[0]);
    } catch (e) {
        next(e);
    }
});

// Add comment to a gift
router.post('/:id/comments', authMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const giftId = req.params.id;
        const { content } = req.body;
        const userId = req.user._id;

        // Silently return success if comment is inappropriate or too short
        if (!content || content.trim().length < 5 || profanityFilter.isProfane(content)) {
            return res.status(201).json({ message: 'Comment processed' });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newComment = {
            _id: new ObjectId(),
            author: `${user.firstName} ${user.lastName}`,
            content,
            createdAt: new Date()
        };

        const result = await db.collection('comments').insertOne({
            giftId: new ObjectId(giftId),
            ...newComment
        });

        if (!result.insertedId) {
            return res.status(500).json({ error: 'Failed to add comment' });
        }

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Error adding comment', details: error.message });
    }
});

// Get comments for a gift
router.get('/:id/comments', authMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const giftId = req.params.id;

        const comments = await db.collection('comments')
            .find({ giftId: new ObjectId(giftId) })
            .sort({ createdAt: -1 })
            .toArray();

        // Filter appropriate comments silently
        const appropriateComments = comments.filter(comment => {
            return !profanityFilter.isProfane(comment.content) && comment.content.length >= 5;
        });

        res.json(appropriateComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

module.exports = router;
