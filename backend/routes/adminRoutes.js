const express = require('express');
const router = express.Router();
const Problem = require('../models/problem');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Add Problem (only admin)
router.post('/add-problem', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const problem = new Problem(req.body);
        await problem.save();
        res.json({ message: 'Problem added successfully', id: problem._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add problem' });
    }
});

router.get('/dashboard-stats', async (req, res) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();

        // Count total problems
        const totalProblems = await Problem.countDocuments();

        // Count unique companies
        const uniqueCompaniesResult = await Problem.aggregate([
            { $unwind: "$companies" }, // Breaks companies array into separate docs
            { $group: { _id: "$companies" } }, // Groups by company
        ]);

        res.json({
            totalUsers,
            totalProblems,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});
module.exports = router;
