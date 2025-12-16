const { GoogleGenerativeAI } = require("@google/generative-ai");

// Fetch key from env or direct input (since I can't read .env.local easily in script without dotenv)
// Using logic to read .env.local manually or just using the key provided by user in history
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
} catch (e) {
    console.error("Could not read .env.local");
}

if (!apiKey) {
    // Fallback to the one user provided in chat
    apiKey = "AIzaSyAzpMOD887O2ZvLNx9Ven8h9xJAgu9Q5mE";
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // For ListModels we might need to use the model manager if exposed, 
        // but the SDK structure is usually genAI.getGenerativeModel.
        // Actually, listing models is often a separate API call.
        // Let's try to just run a simple generation with 'gemini-pro' as a fallback check first,
        // as listModels might not be directly exposed in the high level GoogleGenerativeAI class in older versions,
        // but let's check the objects.

        // Changing approach: The error suggested "Call ListModels".
        // In the Node SDK, checking if we can do that.
        // If not, we will test 3 common candidates: gemini-pro, gemini-1.5-flash, gemini-1.0-pro

        const candidates = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-pro", "gemini-1.0-pro"];

        console.log("Testing model availability...");

        for (const modelName of candidates) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                const response = await result.response;
                console.log("SUCCESS ✅");
            } catch (e) {
                console.log(`FAILED ❌ (${e.message.split(':')[0]})`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

listModels();
