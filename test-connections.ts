import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load env vars from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

console.log('Checking connections...');
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Missing');
console.log('Gemini Key:', geminiKey ? 'Set' : 'Missing');

async function test() {
    // 1. Test Supabase
    if (supabaseUrl && supabaseKey) {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase.storage.listBuckets();
            if (error) {
                console.error('Supabase Storage Error:', error.message);
            } else {
                console.log('Supabase Buckets:', data.map(b => b.name));
                const scansBucket = data.find(b => b.name === 'Platex');
                if (!scansBucket) {
                    console.error('WARNING: "Platex" bucket not found!');
                } else {
                    console.log('"Platex" bucket exists.');
                }
            }
        } catch (e) {
            console.error('Supabase Exception:', e);
        }
    }

    // 2. Test Gemini
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            console.log('Gemini Response:', response.text());
        } catch (e: any) {
            console.error('Gemini Exception:', e.message || e);
        }
    }
}

test();
