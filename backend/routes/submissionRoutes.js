const express = require('express');
const router = express.Router();
const runCode = require('../utils/judge0');
const Submission = require('../models/Submission');
const Problem = require('../models/problem');
const User = require('../models/User'); // import User model here
const auth = require('../middleware/authMiddleware');
require('dotenv').config();

router.post('/', auth, async (req, res) => {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    let verdict = "Accepted";
    let failingCase = null;

    for (let tc of problem.testCases) {
        const result = await runCode({ source_code: code, stdin: tc.input, language });

        const output = result.stdout?.trim() || '';
        const expected = tc.output.trim();

        if (output !== expected) {
            verdict = "Wrong Answer";
            failingCase = { input: tc.input, expected, got: output };
            break;
        }
    }

    const sub = new Submission({
        userId,
        problemId,
        code,
        language,
        verdict,
        details: failingCase ? JSON.stringify(failingCase, null, 2) : ''
    });

    await sub.save();

    if (verdict === "Accepted") {
        try {
            const user = await User.findById(userId);
            if (user) {
                const alreadySolved = user.solvedProblems.some(
                    pid => pid.toString() === problemId.toString()
                );

                if (!alreadySolved) {
                    user.solvedProblems.push(problemId);

                    console.log("Problem difficulty:", problem.difficulty);
                    const difficultyMap = { Easy: 5, Medium: 10, Hard: 20 };
                    const ratingIncrease = difficultyMap[problem.difficulty] || 10;

                    console.log("User rating before:", user.rating);
                    user.rating = Number(user.rating) + ratingIncrease;
                    console.log("User rating after:", user.rating);

                    await user.save();
                    console.log(`Updated rating for user ${user.username}: ${user.rating}`);
                }
            }
        } catch (err) {
            console.error('Error updating user rating:', err);
        }
    }

    res.json({
        submission: sub,
        verdict,
        details: failingCase ?
            `❌ Failed on input:\n${failingCase.input}\nExpected: ${failingCase.expected}\nGot: ${failingCase.got}`
            : '✅ All testcases passed!'
    });
});


module.exports = router;
