require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../models/problem'); // Adjust path if needed

/**
 * Analyze the problem description text and generate human-readable
 * input and output format descriptions.
 */
function generateInputOutputFormats(description) {
    if (!description || typeof description !== 'string') {
        return {
            inputFormat: "Input: Parameters as described in the problem.",
            outputFormat: "Output: As described in the problem statement."
        };
    }

    const desc = description.toLowerCase();

    // INPUT format detection:
    // Order matters: more specific types should be checked before generic ones.
    let inputFormat = "Input: Parameters as described in the problem.";

    if (/\barray of integers\b/.test(desc) || /\binteger array\b/.test(desc) || /\blist of integers\b/.test(desc)) {
        inputFormat = "Input: An integer array.";
    } else if (/\barray of strings\b/.test(desc) || /\bstring array\b/.test(desc) || /\blist of strings\b/.test(desc)) {
        inputFormat = "Input: A string array.";
    } else if (/\b2d array\b/.test(desc) || /\bmatrix\b/.test(desc) || /\btwo-dimensional array\b/.test(desc) || /\bgrid\b/.test(desc)) {
        inputFormat = "Input: A 2D array (matrix).";
    } else if (/\blinked list\b/.test(desc)) {
        inputFormat = "Input: The head of a linked list.";
    } else if (/\bbinary tree\b/.test(desc)) {
        inputFormat = "Input: The root node of a binary tree.";
    } else if (/\bgraph\b/.test(desc)) {
        inputFormat = "Input: A graph represented by adjacency list or matrix.";
    } else if (/\bstring\b/.test(desc)) {
        inputFormat = "Input: A string.";
    } else if (/\binteger\b/.test(desc) && !/\barray\b/.test(desc) && !/\bstring\b/.test(desc)) {
        inputFormat = "Input: An integer or multiple integers.";
    } else if (/\bboolean\b/.test(desc)) {
        inputFormat = "Input: A boolean value.";
    }

    // OUTPUT format detection:
    let outputFormat = "Output: As described in the problem statement.";

    if (/\breturn true\b/.test(desc) || /\breturn false\b/.test(desc) || /\bboolean\b/.test(desc)) {
        outputFormat = "Output: A boolean value (true or false).";
    } else if (/\breturn an array\b/.test(desc) || /\breturn list\b/.test(desc) || /\breturn a list\b/.test(desc) || /\breturn array\b/.test(desc)) {
        if (/\bstring\b/.test(desc)) {
            outputFormat = "Output: A string array.";
        } else if (/\binteger\b/.test(desc)) {
            outputFormat = "Output: An integer array.";
        } else {
            outputFormat = "Output: An array (list) of elements.";
        }
    } else if (/\breturn an integer\b/.test(desc) || /\breturn the number\b/.test(desc) || /\breturn count\b/.test(desc)) {
        outputFormat = "Output: An integer.";
    } else if (/\breturn a string\b/.test(desc)) {
        outputFormat = "Output: A string.";
    } else if (/\bmodify the array\b/.test(desc) || /\bin-place\b/.test(desc) || /\bmodify input\b/.test(desc)) {
        outputFormat = "Output: The modified input array (in-place).";
    } else if (/\breturn the root\b/.test(desc) || /\bbinary tree\b/.test(desc)) {
        outputFormat = "Output: The root node of a binary tree.";
    } else if (/\breturn linked list\b/.test(desc)) {
        outputFormat = "Output: The head of a linked list.";
    }

    return { inputFormat, outputFormat };
}

async function fillInputOutputFormats() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        const problems = await Problem.find({});
        console.log(`📝 Found ${problems.length} problems`);

        for (const problem of problems) {
            const { inputFormat, outputFormat } = generateInputOutputFormats(problem.description);

            problem.inputFormat = inputFormat;
            problem.outputFormat = outputFormat;

            await problem.save();
            console.log(`Updated problem: ${problem.title} with inputFormat and outputFormat`);
        }

        console.log('🎉 Finished updating all problems');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

fillInputOutputFormats();
