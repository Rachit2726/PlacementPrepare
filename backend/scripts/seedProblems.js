require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const he = require('he'); // to decode HTML entities if needed
const CompanyQuestion = require('../models/CompanyQuestion');
const Problem = require('../models/problem');

async function fetchLeetCodeProblem(titleSlug) {
    const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        content
        difficulty
        sampleTestCase
        codeSnippets {
          lang
          code
        }
      }
    }`;

    const variables = { titleSlug };

    try {
        const response = await axios.post(
            'https://leetcode.com/graphql',
            { query, variables },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors.map(e => e.message).join(', '));
        }

        return response.data.data.question;
    } catch (err) {
        console.error(`Error fetching problem ${titleSlug}:`, err.message);
        return null;
    }
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    const companyQuestions = await CompanyQuestion.find({});
    console.log(`Found ${companyQuestions.length} company questions`);

    for (const cq of companyQuestions) {
        if (!cq.link) {
            console.log(`Skipping question with no link: ${cq.question || '(no question text)'}`);
            continue;
        }

        try {
            // Extract titleSlug from URL (handle trailing slash)
            const urlParts = cq.link.split('/').filter(Boolean);
            const titleSlug = urlParts[urlParts.length - 1];

            console.log(`Fetching problem: ${titleSlug}`);

            const problemData = await fetchLeetCodeProblem(titleSlug);

            if (!problemData) {
                console.log(`Failed to fetch problem data for ${titleSlug}`);
                continue;
            }

            // Decode and clean HTML description
            let description = problemData.content ? he.decode(problemData.content) : '';
            description = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

            // LeetCode sampleTestCase is input only, output is missing so leave empty or fill later
            const sampleIO = problemData.sampleTestCase
                ? [{ input: problemData.sampleTestCase.trim(), output: '' }]
                : [];

            const problemDoc = {
                title: problemData.title || titleSlug,
                description,
                difficulty: problemData.difficulty || '',
                sampleIO,
                testCases: [], // Fill manually or by other means later
                tags: [],
                companies: [cq.company],
                inputFormat: '',
                outputFormat: '',
                constraints: '',
            };

            let existingProblem = await Problem.findOne({ title: problemDoc.title });

            if (!existingProblem) {
                existingProblem = new Problem(problemDoc);
                await existingProblem.save();
                console.log(`Saved new problem: ${problemDoc.title}`);
            } else {
                // Add company if not already present
                if (!existingProblem.companies.includes(cq.company)) {
                    existingProblem.companies.push(cq.company);
                    await existingProblem.save();
                    console.log(`Updated companies for problem: ${existingProblem.title}`);
                } else {
                    console.log(`Problem already exists: ${existingProblem.title}`);
                }
            }

            // Update CompanyQuestion with problemId if not set or different
            if (!cq.problemId || cq.problemId.toString() !== existingProblem._id.toString()) {
                cq.problemId = existingProblem._id;
                await cq.save();
                console.log(`Linked CompanyQuestion "${cq.question}" to problem ID: ${existingProblem._id}`);
            }

        } catch (err) {
            console.error(`Error processing question "${cq.question}":`, err.message);
        }
    }

    await mongoose.disconnect();
    console.log('Done!');
}

main();
