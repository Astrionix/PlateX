# PlateX Setup & Verification Instructions

## 1. Apply Supabase Database Schema

### Step 1: Login to Supabase
1. Go to: https://supabase.com/dashboard/project/cxrvojtpmdeidwpepsmp
2. Login with your credentials

### Step 2: Apply Schema
1. Navigate to SQL Editor: https://supabase.com/dashboard/project/cxrvojtpmdeidwpepsmp/sql/new
2. Copy and paste the entire content from `supabase_schema.sql` (shown below)
3. Click "Run" to execute

```sql
-- Enable uuid extension
create extension if not exists "pgcrypto";

-- users table (supabase provides auth; keep a profile table)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid references auth.users(id),
  display_name text,
  timezone text,
  
  -- Physical Stats
  age integer,
  gender text,
  height_cm numeric,
  weight_kg numeric,
  activity_level text,
  
  -- Goals & Preferences
  goal text,
  dietary_preference text,
  allergies text[],
  medical_conditions text[],
  
  -- Calculated Targets
  daily_calorie_target numeric,
  daily_protein_target numeric,
  daily_carbs_target numeric,
  daily_fat_target numeric,
  daily_water_target numeric,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ingredient catalog
create table if not exists ingredient_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  typical_serving_g numeric,
  calories_per_100g numeric,
  carbs_per_100g numeric,
  protein_per_100g numeric,
  fat_per_100g numeric,
  last_updated timestamptz default now()
);

-- food logs
create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  image_url text,
  
  -- Analysis Data
  raw_model_output jsonb,
  ingredients jsonb,
  
  -- Totals
  total_calories numeric,
  total_carbs numeric,
  total_protein numeric,
  total_fat numeric,
  total_fiber numeric,
  total_sugar numeric,
  
  -- Health & Insights
  health_score numeric,
  glycemic_load text,
  warnings text[],
  
  meal_type text,
  created_at timestamptz default now()
);

create index if not exists idx_food_logs_user on food_logs (user_id);
create index if not exists idx_food_logs_created on food_logs (created_at desc);
```

### Step 3: Create Storage Bucket
1. Navigate to Storage: https://supabase.com/dashboard/project/cxrvojtpmdeidwpepsmp/storage/buckets
2. Create a new bucket named `Platex`
3. Make it **Public** (so image URLs work)
4. Set the following MIME types as allowed:
   - image/jpeg
   - image/png
   - image/webp

## 2. Verify Environment Variables

Your `.env.local` should contain:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key
```

✅ **Status: Already configured correctly**

## 3. Test All Features

### Feature Checklist

#### ✅ Demo Mode
- [x] Navigate to http://localhost:3000
- [x] Click "Try with Demo Image"
- [x] Verify ResultsCard displays mock data
- [x] Verify Blood Sugar Impact chart shows

#### 🔄 Real Image Analysis
- [ ] Upload a real food image
- [ ] Verify AI analysis completes
- [ ] Verify data saved to Supabase
- [ ] Verify image stored in bucket

#### 🔄 Profile Management
- [ ] Navigate to /profile
- [ ] Fill in personal details
- [ ] Select allergies and medical conditions
- [ ] Verify daily targets auto-calculate
- [ ] Save profile
- [ ] Verify saved to Supabase

#### 🔄 Diet Planner
- [ ] Ensure profile is complete
- [ ] Navigate to /planner
- [ ] Click "Generate Daily Plan"
- [ ] Verify meal plan displays
- [ ] Test "Regenerate Plan"

#### 🔄 History
- [ ] Perform multiple scans
- [ ] Verify scans appear in sidebar
- [ ] Click on a previous scan
- [ ] Verify it loads correctly

#### 🔄 Settings
- [ ] Navigate to /settings
- [ ] Toggle unit system
- [ ] Toggle notifications
- [ ] Test "Clear All Data"

## 4. Common Issues & Fixes

### Issue: "API key not valid"
**Solution:** Restart dev server after changing `.env.local`
```bash
taskkill /F /IM node.exe
npm run dev
```

### Issue: "Storage error" when uploading images
**Solution:** 
1. Check that `Platex` bucket exists in Supabase Storage
2. Verify bucket is set to Public
3. Check MIME types are allowed

### Issue: Database insert fails
**Solution:**
1. Ensure schema is applied (see Step 1)
2. Check Supabase logs for errors
3. Verify `user_id` foreign key constraint (may need to allow NULL temporarily)

### Issue: History not showing
**Solution:**
1. Check browser console for errors
2. Verify `food_logs` table has data
3. Check Supabase RLS policies (may need to disable for testing)

## 5. Next Steps

Once all features are verified:

### Option A: Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Option B: Add New Features
- [ ] Weekly nutrition trends dashboard
- [ ] Export meal data to PDF
- [ ] Share meal analysis via link
- [ ] Mobile app version
- [ ] Barcode scanner integration

## 6. Support

If you encounter issues:
1. Check browser console for errors
2. Check terminal for API errors
3. Review Supabase logs
4. Verify all environment variables are set
