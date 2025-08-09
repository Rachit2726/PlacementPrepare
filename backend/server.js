const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Routes import
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const contestRoutes = require('./routes/contestRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const historyRoutes = require('./routes/historyRoutes');
const profileRoutes = require('./routes/profileRoutes');
const companyRoutes = require('./routes/company');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
// Test route to check API
app.get('/test-route', (req, res) => {
    res.json({ success: true, message: 'Test route working' });
});

// Default root API
app.get('/', (req, res) => {
    res.send("🎯 CodeChamp Backend is Live");
});

// MongoDB + Server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('⚡ New client connected');

    socket.on('join-contest', (contestId) => {
        socket.join(contestId);
    });

    socket.on('update-leaderboard', (contestId, leaderboard) => {
        io.to(contestId).emit('leaderboard-update', leaderboard);
    });

    socket.on('disconnect', () => console.log('❌ Client disconnected'));
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB connected");
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.log("❌ MongoDB connection error:", err));

// -------- Serve React Frontend --------
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all for non-API routes (Frontend)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
