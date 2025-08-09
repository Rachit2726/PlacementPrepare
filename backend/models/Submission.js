const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    code: String,
    language: String,
    verdict: String, // Accepted, WA, TLE, etc.
    details: String,
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
