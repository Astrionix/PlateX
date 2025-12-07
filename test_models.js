
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testModel(modelName) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    try {
        console.log(`Testing ${modelName}...`);
        const result = await model.generateContent("Hello, are you there?");
        console.log(`SUCCESS: ${modelName} responded:`, result.response.text().substring(0, 50));
        return true;
    } catch (e) {
        console.log(`FAILED: ${modelName} error:`, e.message);
        return false;
    }
}

async function main() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-flash-latest");
    await testModel("gemini-1.5-flash-001");
    await testModel("gemini-1.5-pro");
    await testModel("gemini-pro");
}
main();
