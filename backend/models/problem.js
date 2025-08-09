const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    inputFormat: String,
    outputFormat: String,
    constraints: String,
    sampleIO: [{ input: String, output: String }],
    testCases: [{ input: String, output: String }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    tags: [String],
    companies: [String],
});

module.exports = mongoose.model('Problem', ProblemSchema);
