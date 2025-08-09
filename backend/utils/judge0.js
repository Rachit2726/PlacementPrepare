const axios = require('axios');

const languageIds = {
    cpp: 54,
    c: 50,
    java: 62,
    python: 71
};

async function runCode({ source_code, stdin, language }) {
    const langId = languageIds[language];
    const res = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        language_id: langId,
        source_code,
        stdin,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    });

    const token = res.data.token;
    let result;

    while (true) {
        const status = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });

        result = status.data;
        if (result.status.id <= 2) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec
        } else {
            break;
        }
    }

    return result;
}

module.exports = runCode;
