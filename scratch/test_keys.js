async function testGroq() {
    console.log('Testing Groq...');
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: 'Responde solo con la palabra: OK' }]
            })
        });
        const data = await response.json();
        if (data.choices) {
            console.log('Groq Response:', data.choices[0].message.content);
        } else {
            console.error('Groq Unexpected Response:', data);
        }
    } catch (error) {
        console.error('Groq Error:', error.message);
    }
}

async function testGemini() {
    console.log('Testing Gemini...');
    const key = process.env.GOOGLE_API_KEY || "AIzaSyDOhBdp3h78Bh01OSTNMCanW-6BEA0LBeI";
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Responde solo con la palabra: OK' }] }]
            })
        });
        const data = await response.json();
        if (data.candidates) {
            console.log('Gemini Response:', data.candidates[0].content.parts[0].text);
        } else {
            console.error('Gemini Unexpected Response:', data);
        }
    } catch (error) {
        console.error('Gemini Error:', error.message);
    }
}

async function testOpenRouter() {
    console.log('Testing OpenRouter...');
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-pro-1.5',
                messages: [{ role: 'user', content: 'Responde solo con la palabra: OK' }]
            })
        });
        const data = await response.json();
        if (data.choices) {
            console.log('OpenRouter Response:', data.choices[0].message.content);
        } else {
            console.error('OpenRouter Unexpected Response:', data);
        }
    } catch (error) {
        console.error('OpenRouter Error:', error.message);
    }
}

async function testNvidia() {
    console.log('Testing Nvidia...');
    try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'nvidia/llama-3.1-405b-instruct',
                messages: [{ role: 'user', content: 'Responde solo con la palabra: OK' }]
            })
        });
        const data = await response.json();
        if (data.choices) {
            console.log('Nvidia Response:', data.choices[0].message.content);
        } else {
            console.error('Nvidia Unexpected Response:', data);
        }
    } catch (error) {
        console.error('Nvidia Error:', error.message);
    }
}

async function runTests() {
    await testGroq();
    await testGemini();
    await testOpenRouter();
    await testNvidia();
}

runTests();
