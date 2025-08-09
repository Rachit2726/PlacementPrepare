const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        let user;

        // ✅ 1. Allow fake token for testing
        if (token === 'fake-jwt-token') {
            user = await User.findOne(); // pick the first user in DB
            if (!user) {
                return res.status(401).json({ error: 'Test user not found' });
            }
        }
        // ✅ 2. Real JWT verification
        else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        // ✅ Attach the full user to req
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
