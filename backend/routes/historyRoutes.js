const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
    const submissions = await Submission.find({ userId: req.user.id })
        .populate('problemId', 'title')
        .sort({ submittedAt: -1 });
    res.json(submissions);
});

module.exports = router;
