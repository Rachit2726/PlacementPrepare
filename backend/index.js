const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Welcome route (to fix "Cannot GET /")
app.get('/', (req, res) => {
    res.send('🎉 Welcome to CodeChamp API');
});

// ✅ Dummy REGISTER route
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // For now just log and return success
    console.log("📥 User registered:", req.body);
    return res.status(201).json({ message: "User registered successfully" });
});

// ✅ Dummy LOGIN route
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    // Return dummy token
    console.log("🔐 Login:", req.body);
    return res.status(200).json({ message: "Login successful", token: "fake-jwt-token" });
});

// ✅ Dummy Problem List route
app.get('/api/problems', (req, res) => {
    res.json([
        { _id: 1, title: "Two Sum", difficulty: "Easy" },
        { _id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium" }
    ]);
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
