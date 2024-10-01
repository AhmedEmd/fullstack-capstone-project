const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

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
const { ObjectId } = require('mongodb'); // Use ObjectId instead of ObjectID

router.get('/:_id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params._id;

        // Log the id received
        console.log('Received ID:', id);

        // Validate if the ID is a valid MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }

        // Log the ObjectId conversion
        const objectId = new ObjectId(id);
        console.log('Converted ObjectId:', objectId);

        // Fetch the document by ObjectId
        const gift = await collection.findOne({ _id: objectId });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e.message, e.stack);
        res.status(500).send(`Error fetching gift: ${e.message}`);
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
