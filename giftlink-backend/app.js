/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3060;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB; we just do this one time
const mongoUri = process.env.MONGO_URL;

if (!mongoUri) {
    throw new Error("MongoDB connection string is missing in the .env file");
}

app.use(express.json());

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
const giftroutes = require('./routes/giftRoutes');

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes');

// Add authentication routes
const authRoutes = require('./routes/authRoutes'); // Add this line

// Mount routes
app.use('/api/gifts', giftroutes); // Endpoint for handling gifts (e.g., CRUD operations)
app.use('/api/search', searchRoutes); // Endpoint for handling search operations
app.use('/api/gifts/search', searchRoutes); // Updated route for handling multiple search parameters
app.use('/api/auth', authRoutes); // Change this line

// Pino HTTP logger
const pinoHttp = require('pino-http');
const logger = require('./logger');
app.use(pinoHttp({ logger }));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Catch-all route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// a basic endpoint for health check
app.get("/", (req, res) => {
    res.send("Inside the server")
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Serve static files from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
