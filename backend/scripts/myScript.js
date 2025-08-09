require('dotenv').config();
const mongoose = require('mongoose');
const he = require('he');
const Problem = require('../models/problem');

function cleanValue(val) {
    val = he.decode(val); // decode HTML entities
    val = val.replace(/\u00A0/g, ' ').trim(); // replace non-breaking spaces

    // Remove any leading variable assignment like `n =`, `input =`
    val = val.replace(/^[a-zA-Z0-9_]+\s*=\s*/, '');

    // Remove surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).trim();
    }

    return val;
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const problems = await Problem.find({});
    console.log(`Found ${problems.length} problems`);

    const regex = /Input:\s*([\s\S]*?)\s*Output:\s*([\s\S]*?)(?=\s*Input:|$)/gi;

    for (const problem of problems) {
        if (!problem.description) {
            console.log(`Skipping problem ${problem._id} (${problem.title}): No description`);
            continue;
        }

        // Strip HTML tags and normalize whitespace
        let stripped = problem.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        let matches = [];
        let match;

        while ((match = regex.exec(stripped)) !== null) {
            let input = cleanValue(match[1]);
            let output = cleanValue(match[2]);

            // Remove trailing explanation/notes/hints after output
            output = output.split(/\n{2,}|Explanation:|Note:|Constraints:|Hint:/i)[0].trim();

            // Remove trailing "Example X:" or "Example X" at end of output
            output = output.replace(/Example\s*\d+:\s*$/i, '').replace(/Example\s*\d+\s*$/i, '').trim();

            if (input.length === 0 || output.length === 0) continue;

            matches.push({ input, output });
        }

        if (matches.length === 0) {
            console.log(`No examples found for problem ${problem._id} (${problem.title})`);
            continue;
        }

        problem.sampleIO = [matches[0]]; // First example goes to sampleIO
        problem.testCases = matches.slice(1); // Rest go to testCases

        try {
            await problem.save();
            console.log(`Updated problem ${problem._id} (${problem.title}): sampleIO and ${problem.testCases.length} testCases saved.`);
        } catch (e) {
            console.error(`Failed to save problem ${problem._id} (${problem.title}):`, e);
        }
    }

    console.log('Done updating problems.');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    mongoose.disconnect();
});
