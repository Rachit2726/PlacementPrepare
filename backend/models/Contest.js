const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
    name: String,
    startTime: Date,
    endTime: Date,
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Contest', ContestSchema);
