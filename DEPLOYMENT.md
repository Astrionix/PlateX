# Deploying PlateX to Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Supabase project (already set up)
- Gemini API key (already have)

## Step 1: Prepare for Deployment

### 1.1 Create `.vercelignore` (optional)
Already handled by `.gitignore`

### 1.2 Ensure environment variables are documented
Check `.env.example` - ✓ Already created

## Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - PlateX Food Analyzer"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/platex.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vxpkgzuykitunmejfwoe.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   NUTRITIONIX_APP_ID=(optional)
   NUTRITIONIX_APP_KEY=(optional)
   ```

6. Click "Deploy"

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then add environment variables:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

## Step 4: Post-Deployment

### 4.1 Update Supabase Settings (if needed)
- Go to Supabase Dashboard → Settings → API
- Add your Vercel domain to allowed origins if using RLS

### 4.2 Test Your Deployment
1. Visit your Vercel URL
2. Upload a test image
3. Check browser console for any errors
4. Verify Supabase storage and database entries

## Troubleshooting

### Build Errors
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Runtime Errors
- Check Vercel Function logs
- Verify environment variables are set correctly
- Check Supabase bucket permissions (should be public or have proper policies)

### API Route Issues
- Vercel Functions have a 10s timeout on Hobby plan
- Gemini API calls should complete within this time
- Consider upgrading to Pro if needed

## Important Notes

1. **Supabase Bucket**: Ensure `Platex` bucket exists and is public
2. **Database Tables**: Run `supabase_schema.sql` in Supabase SQL Editor
3. **Environment Variables**: Never commit `.env.local` to git
4. **API Keys**: Keep them secure in Vercel environment variables

## Your Vercel URL
After deployment, you'll get a URL like:
`https://platex-username.vercel.app`

## Continuous Deployment
Every push to `main` branch will automatically trigger a new deployment on Vercel.
