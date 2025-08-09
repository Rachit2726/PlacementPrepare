const mongoose = require('mongoose');

const CompanyQuestionSchema = new mongoose.Schema({
    question: String,
    link: String,
    frequency: Number,
    company: String,
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' } // add this to link main problem
});

module.exports = mongoose.model('CompanyQuestion', CompanyQuestionSchema);
