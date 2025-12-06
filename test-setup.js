// Test script to verify all PlateX functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    console.log('\n🧪 Testing Supabase Connection...\n');

    try {
        // Test 1: Check tables exist
        console.log('1️⃣ Checking if tables exist...');

        const tables = ['profiles', 'food_logs', 'ingredient_catalog'];
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`   ❌ Table '${table}' error: ${error.message}`);
                if (error.message.includes('does not exist')) {
                    console.log(`   ⚠️  Please run the SQL schema in Supabase SQL Editor`);
                }
            } else {
                console.log(`   ✅ Table '${table}' exists`);
            }
        }

        // Test 2: Check storage bucket
        console.log('\n2️⃣ Checking storage bucket...');
        const { data: buckets, error: bucketError } = await supabase
            .storage
            .listBuckets();

        if (bucketError) {
            console.log(`   ❌ Storage error: ${bucketError.message}`);
        } else {
            const platexBucket = buckets.find(b => b.name === 'Platex');
            if (platexBucket) {
                console.log(`   ✅ 'Platex' bucket exists`);
                console.log(`   📊 Bucket is ${platexBucket.public ? 'PUBLIC' : 'PRIVATE'}`);
            } else {
                console.log(`   ❌ 'Platex' bucket not found`);
                console.log(`   ⚠️  Please create it in Supabase Storage`);
            }
        }

        // Test 3: Test insert and delete (cleanup)
        console.log('\n3️⃣ Testing database write permissions...');
        const testLog = {
            image_url: 'https://test.com/image.jpg',
            total_calories: 100,
            total_carbs: 10,
            total_protein: 10,
            total_fat: 5,
            total_fiber: 2,
            total_sugar: 3,
            health_score: 75,
            glycemic_load: 'Low',
            warnings: ['Test'],
            ingredients: [{ name: 'Test', calories: 100 }]
        };

        const { data: insertData, error: insertError } = await supabase
            .from('food_logs')
            .insert(testLog)
            .select()
            .single();

        if (insertError) {
            console.log(`   ❌ Insert failed: ${insertError.message}`);
        } else {
            console.log(`   ✅ Insert successful`);

            // Cleanup
            const { error: deleteError } = await supabase
                .from('food_logs')
                .delete()
                .eq('id', insertData.id);

            if (!deleteError) {
                console.log(`   ✅ Cleanup successful`);
            }
        }

        console.log('\n✅ Supabase connection test complete!\n');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

async function testAPIKeys() {
    console.log('\n🔑 Testing API Keys...\n');

    // Test Gemini
    console.log('1️⃣ Gemini API Key:');
    if (process.env.GEMINI_API_KEY) {
        console.log(`   ✅ Set (${process.env.GEMINI_API_KEY.substring(0, 10)}...)`);
    } else {
        console.log(`   ❌ Not set`);
    }

    // Test Groq
    console.log('\n2️⃣ Groq API Key:');
    if (process.env.GROQ_API_KEY) {
        console.log(`   ✅ Set (${process.env.GROQ_API_KEY.substring(0, 10)}...)`);
    } else {
        console.log(`   ❌ Not set`);
    }

    // Test Supabase
    console.log('\n3️⃣ Supabase Keys:');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.log(`   ✅ URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    } else {
        console.log(`   ❌ URL not set`);
    }
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log(`   ✅ Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`);
    } else {
        console.log(`   ❌ Anon Key not set`);
    }
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log(`   ✅ Service Role Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`);
    } else {
        console.log(`   ❌ Service Role Key not set`);
    }
}

// Run tests
(async () => {
    await testAPIKeys();
    await testSupabaseConnection();
})();
