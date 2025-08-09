const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// 🔹 Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ username, email: normalizedEmail });

        // ✅ Assign admin if matches
        if (normalizedEmail === adminEmail) {
            user.role = 'admin';
        } else {
            user.role = 'user';
        }

        await user.setPassword(password);
        await user.save();

        const token = generateToken(user);
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// 🔹 Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // ✅ Upgrade role to admin if matches
        if (normalizedEmail === adminEmail && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        const token = generateToken(user);
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
