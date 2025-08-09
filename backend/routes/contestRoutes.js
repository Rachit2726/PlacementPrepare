const express = require('express');
const Contest = require('../models/Contest');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Create a contest (admin)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

    const contest = new Contest(req.body);
    await contest.save();
    res.json({ message: 'Contest created' });
});

// Get all contests
router.get('/', async (req, res) => {
    const contests = await Contest.find().select('name startTime endTime');
    res.json(contests);
});

// Join contest
router.post('/:id/join', auth, async (req, res) => {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ error: 'Contest not found' });

    if (!contest.participants.includes(req.user.id)) {
        contest.participants.push(req.user.id);
        await contest.save();
    }

    res.json({ message: 'Joined contest' });
});

// Get contest details (problems + timer)
router.get('/:id', auth, async (req, res) => {
    const contest = await Contest.findById(req.params.id).populate('problems');
    if (!contest) return res.status(404).json({ error: 'Not found' });
    res.json(contest);
});

module.exports = router;
