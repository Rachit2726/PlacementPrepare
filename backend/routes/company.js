const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const CompanyQuestion = require('../models/CompanyQuestion');
const auth = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const router = express.Router();

const companies = [
    "Adobe", "Amazon", "Apple", "Arcesium", "Atlassian", "Belden", "Bloomberg",
    "Booking.com", "Cisco", "Citadel", "Cure.Fit", "D-E-Shaw", "Directi", "Expedia",
    "FactSet", "Flipkart", "Goldman Sachs", "Google", "InMobi", "Intuit", "Linkedin",
    "Lucid", "MakeMyTrip", "Morgan Stanley", "Nutanix", "Ola Cabs", "Oracle", "Paytm",
    "Qualcomm", "Salesforce", "Samsung", "ServiceNow", "Snapchat", "Sprinklr", "Swiggy",
    "Tower Research", "Twitter", "Uber", "Visa", "VMWare", "Walmart Labs", "Wells Fargo",
    "Zeta", "Zoom", "Zoho", "Redfin", "DoorDash", "Square", "Airbnb", "Facebook",
    "Meta", "Pinterest", "Adobe Systems", "Nvidia", "Tesla", "Bloomreach", "Tesla AI",
    "Stripe", "Razorpay", "Gojek", "TCS", "Infosys", "Wipro", "Tech Mahindra", "Cognizant",
    "HCL", "Capgemini", "Accenture", "Mindtree", "LTI", "IBM", "Persistent Systems",
    "ThoughtWorks", "Media.net", "Cogoport", "Oyo", "Oppo", "OnePlus", "Realme",
    "IQVIA", "Mu Sigma", "ZS Associates", "Bain", "BCG", "McKinsey", "EY", "Deloitte",
    "KPMG", "PwC", "PayPal", "eBay", "NetApp", "Western Digital", "HP", "Dell", "Cisco Meraki",
    "Juniper", "VMWare", "Dropbox", "GitHub", "Bitbucket", "DigitalOcean", "JetBrains",
    "Red Hat", "Canonical", "MongoDB", "Elastic", "Databricks", "Snowflake", "Cloudera",
    "Hortonworks", "Palantir", "Slack", "Notion", "Asana", "Trello", "ClickUp",
    "Calendly", "Zomato", "Yulu", "Rapido", "Dunzo", "Meesho", "Nykaa", "BigBasket",
    "Udaan", "Byju's", "Unacademy", "Vedantu", "WhiteHat Jr", "Scaler", "UpGrad",
    "Khan Academy", "Coursera", "edX", "CodeChef", "Codeforces", "HackerRank",
    "HackerEarth", "CodeSignal", "LeetCode", "GeeksforGeeks", "InterviewBit",
    "OpenAI", "DeepMind", "Anthropic", "Cohere", "HuggingFace", "Nuro", "Cruise",
    "Waymo", "Zoox", "Aurora", "Bird", "Lime", "Swvl", "Careem", "Grab", "Flip",
    "Inshorts", "DailyHunt", "ShareChat", "Chingari", "Koo", "Clubhouse", "Spotify",
    "Gaana", "JioSaavn", "Netflix", "Hotstar", "Prime Video", "Sony Liv", "MX Player",
    "PhonePe", "Google Pay", "BharatPe", "Mobikwik", "Freecharge", "Paytm Payments Bank",
    "ICICI", "Axis Bank", "HDFC", "Kotak Mahindra", "Yes Bank", "IDFC FIRST",
    "IndusInd Bank", "SBI", "Bank of Baroda", "PNB", "Canara Bank", "Union Bank",
    "Federal Bank", "AU Small Finance Bank", "Fino Payments Bank"
];

router.get('/sync-all', async (req, res) => {
    let syncedCompanies = [];
    let failedCompanies = [];

    for (const company of companies) {
        const csvUrl = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${encodeURIComponent(company)}/5.%20All.csv`;
        console.log(`🔄 Syncing: ${company}`);

        try {
            const response = await axios.get(csvUrl, { responseType: 'stream' });
            const questions = [];

            await new Promise((resolve, reject) => {
                response.data
                    .pipe(csv())
                    .on('data', (row) => {
                        if (row['Title'] && row['Link']) {
                            questions.push({
                                question: row['Title'],
                                link: row['Link'],
                                frequency: Number(row['Frequency'] || 0),
                                company
                            });
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            await CompanyQuestion.deleteMany({ company });
            await CompanyQuestion.insertMany(questions);
            syncedCompanies.push({ company, count: questions.length });
        } catch (err) {
            console.error(`❌ Failed for ${company}:`, err.message);
            failedCompanies.push({ company, error: err.message });
        }
    }

    res.json({
        success: true,
        synced: syncedCompanies,
        failed: failedCompanies
    });
});

// Get all distinct companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await CompanyQuestion.distinct('company');
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all questions for a specific company (case-insensitive)
router.get('/:companyName/questions', async (req, res) => {
    const { companyName } = req.params;
    try {
        const questions = await CompanyQuestion.find({
            company: { $regex: new RegExp(`^${companyName}$`, 'i') }
        }).sort({ frequency: -1 });
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/company-questions/:id', async (req, res) => {
    try {
        const cq = await CompanyQuestion.findById(req.params.id).populate('problemId');
        if (!cq) return res.status(404).json({ message: 'Company Question not found' });
        res.json(cq);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;