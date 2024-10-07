const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = {
            _id: new ObjectId(decoded._id),
            email: decoded.email
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};