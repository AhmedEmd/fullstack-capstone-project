const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');

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

module.exports = router;
