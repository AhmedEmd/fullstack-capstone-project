const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');

// Search for gifts
router.get('/', async (req, res, next) => {
    console.log('Received search request with query:', req.query);
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID parameter is required' });
        }

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        let query = { _id: new ObjectId(id) };

        console.log('Executing MongoDB query:', JSON.stringify(query));
        const gifts = await collection.find(query).toArray();
        console.log(`Found ${gifts.length} gifts`);
        res.json(gifts);
    } catch (e) {
        console.error('Error searching gifts:', e);
        res.status(500).json({ error: 'Error searching gifts', details: e.message });
    }
});

module.exports = router;
