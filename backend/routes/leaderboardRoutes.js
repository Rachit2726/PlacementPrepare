const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Contest = require('../models/Contest');
const User = require('../models/User');

// Global leaderboard
router.get('/global', async (req, res) => {
    const users = await User.find({}, 'username rating').sort({ rating: -1 });
    res.json(users);
});

// Contest leaderboard
router.get('/contest/:id', async (req, res) => {
    const contestId = req.params.id;
    const contest = await Contest.findById(contestId).populate('problems');

    const submissions = await Submission.find({ problemId: { $in: contest.problems }, verdict: "Accepted" });

    const scores = {};

    submissions.forEach(sub => {
        const uid = sub.userId.toString();
        if (!scores[uid]) scores[uid] = { userId: uid, score: 0, problems: new Set() };
        scores[uid].problems.add(sub.problemId.toString());
    });

    const leaderboard = await Promise.all(Object.values(scores).map(async (entry) => {
        const user = await User.findById(entry.userId);
        return {
            username: user.username,
            score: entry.problems.size
        };
    }));

    leaderboard.sort((a, b) => b.score - a.score);
    res.json(leaderboard);
});

module.exports = router;
