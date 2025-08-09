// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const Problem = require('./models/problem');

// dotenv.config();

// const problems = [
//     {
//         title: "Two Sum",
//         description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
//         inputFormat: "First line contains n, the number of elements.\nSecond line contains n space-separated integers.\nThird line contains the target.",
//         outputFormat: "Two space-separated indices.",
//         constraints: "Each input would have exactly one solution.",
//         sampleIO: [
//             { input: "4\n2 7 11 15\n9", output: "0 1" }
//         ],
//         testCases: [
//             { input: "4\n2 7 11 15\n9", output: "0 1" },
//             { input: "5\n1 4 5 6 7\n10", output: "1 3" }
//         ],
//         difficulty: "Easy",
//         tags: ["array", "hashmap"]
//     },
//     {
//         title: "Longest Substring Without Repeating Characters",
//         description: "Given a string, find the length of the longest substring without repeating characters.",
//         inputFormat: "A single string s.",
//         outputFormat: "An integer - the length of the longest substring.",
//         constraints: "1 <= s.length <= 10^5",
//         sampleIO: [
//             { input: "abcabcbb", output: "3" }
//         ],
//         testCases: [
//             { input: "abcabcbb", output: "3" },
//             { input: "bbbbb", output: "1" }
//         ],
//         difficulty: "Medium",
//         tags: ["string", "sliding window"]
//     }
// ];

// mongoose.connect(process.env.MONGO_URI)
//     .then(async () => {
//         console.log("✅ MongoDB Connected");
//         await Problem.deleteMany(); // Optional: clear old problems
//         await Problem.insertMany(problems);
//         console.log("🌱 Seed data inserted successfully!");
//         process.exit();
//     })
//     .catch(err => {
//         console.error("❌ Error:", err);
//         process.exit(1);
//     });
