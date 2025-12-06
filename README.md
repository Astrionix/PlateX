# PlateX - AI Food Diet Analyzer

PlateX is a responsive web application that uses AI to analyze food images, estimate nutrition (calories, macros), and track your diet.

## Features

- **AI Food Analysis**: Upload an image of your meal, and Gemini AI will identify ingredients and estimate portion sizes.
- **Nutrition Breakdown**: Get detailed calorie, carb, protein, and fat estimates.
- **Health Score**: Receive a health score and suggestions for your meal.
- **Dark Mode UI**: A premium, modern interface with glassmorphism effects.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS v4
- **Backend**: Next.js API Routes
- **AI**: Google Gemini Vision (gemini-1.5-flash)
- **Database & Storage**: Supabase (Postgres, Storage)
- **Visualization**: Recharts

## Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in your keys:
    ```bash
    cp .env.example .env.local
    ```
    Required keys:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `GEMINI_API_KEY`

4.  **Supabase Setup**:
    - Run the SQL script in `supabase_schema.sql` in your Supabase SQL Editor.
    - Create a storage bucket named `scans` and ensure it's public or has appropriate policies.

5.  **Run Locally**:
    ```bash
    npm run dev
    ```

## API Routes

- `POST /api/analyze`: Accepts `multipart/form-data` with an `image` file. Returns JSON analysis.

## License

MIT
