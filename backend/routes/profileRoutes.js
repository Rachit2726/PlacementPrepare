const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Submission = require('../models/Submission');

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    const submissions = await Submission.find({ userId: req.user.id, verdict: 'Accepted' });
    const solved = new Set(submissions.map(s => s.problemId.toString()));
    res.json({ ...user._doc, solvedCount: solved.size });
});

module.exports = router;
