import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No GEMINI_API_KEY found");
    process.exit(1);
}

// Access the API directly to list models via REST if the SDK doesn't expose listModels nicely or if I want to be raw.
// Actually SDK might presumably have it, but looking at docs, there isn't a direct listModels on GoogleGenerativeAI instance?
// Wait, typically it's specific to the manager or just not easily exposed in the high level SDK.
// I'll use fetch to be sure.

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.error("Error listing models:", data.error);
        } else {
            console.log("Available Models:");
            data.models?.forEach((m: any) => {
                if (m.name.includes('gemini')) {
                    console.log(`- ${m.name}`);
                    console.log(`  Supported: ${m.supportedGenerationMethods?.join(', ')}`);
                }
            });
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

listModels();
