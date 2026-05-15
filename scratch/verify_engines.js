const fs = require('fs');
const path = require('path');

// Mock process.env if keys are not set (though I added them to .env.local, 
// they might not be in the current process environment)
const keys = {
    GROQ_API_KEY: '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',
    GOOGLE_API_KEY: 'AIzaSyDOhBdp3h78Bh01OSTNMCanW-6BEA0LBeI',
    VERCEL_API_KEY: 'vck_6bPGlEuPpSYi6xbTXanBBy2p97cujaTCw6qx6nvRYMyZLNVUvZ05g24F'
};

async function testGroq() {
    console.log('--- Testing Groq (Llama 3.3 70B) ---');
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${keys.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: 'Verification task: Respond with "GROQ_READY"' }]
            })
        });
        const data = await response.json();
        if (data.choices) {
            console.log('Result:', data.choices[0].message.content);
            return true;
        } else {
            console.error('Unexpected Response:', JSON.stringify(data).substring(0, 100));
            return false;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

async function testGemini() {
    console.log('--- Testing Gemini (1.5 Flash) ---');
    try {
        // Trying v1 instead of v1beta and adding a fallback for model names
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Verification task: Respond with "GEMINI_READY"' }] }]
            })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0].content) {
            console.log('Result:', data.candidates[0].content.parts[0].text.trim());
            return true;
        } else {
            console.error('Unexpected Response:', JSON.stringify(data).substring(0, 150));
            return false;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

async function testVercel() {
    console.log('--- Testing Vercel API ---');
    try {
        const response = await fetch('https://api.vercel.com/v9/projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${keys.VERCEL_API_KEY}`
            }
        });
        const data = await response.json();
        if (data.projects) {
            console.log('Result: VERCEL_READY (Found ' + data.projects.length + ' projects)');
            return true;
        } else {
            console.error('Unexpected Response:', JSON.stringify(data).substring(0, 100));
            return false;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

async function runAll() {
    const results = {
        groq: await testGroq(),
        gemini: await testGemini(),
        vercel: await testVercel()
    };
    
    console.log('\n--- Final Summary ---');
    console.log(`Groq: ${results.groq ? '✅' : '❌'}`);
    console.log(`Gemini: ${results.gemini ? '✅' : '❌'}`);
    console.log(`Vercel: ${results.vercel ? '✅' : '❌'}`);
}

runAll();
