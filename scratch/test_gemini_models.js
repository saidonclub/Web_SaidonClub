const keys = {
    GOOGLE_API_KEY: 'AIzaSyDOhBdp3h78Bh01OSTNMCanW-6BEA0LBeI'
};

async function testModel(modelName) {
    console.log(`--- Testing ${modelName} ---`);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${keys.GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Verify' }] }]
            })
        });
        const data = await response.json();
        if (data.candidates) {
            console.log(`${modelName}: SUCCESS`);
            return true;
        } else {
            console.error(`${modelName}: FAILED - ${JSON.stringify(data).substring(0, 100)}`);
            return false;
        }
    } catch (error) {
        console.error(`${modelName}: ERROR - ${error.message}`);
        return false;
    }
}

async function run() {
    await testModel('gemini-1.5-flash');
    await testModel('gemini-1.5-flash-latest');
    await testModel('gemini-1.5-pro');
    await testModel('gemini-1.5-pro-latest');
    await testModel('gemini-pro');
}

run();
