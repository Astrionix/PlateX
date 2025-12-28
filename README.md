<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20Groq-FF6F00?logo=google" alt="AI Powered" />
</p>

<h1 align="center">🍽️ PlateX - AI-Powered Nutrition & Diet Analyzer</h1>

<p align="center">
  <b>Transform the way you eat with intelligent food analysis, personalized meal planning, and gamified health tracking.</b>
</p>

---

## ✨ Features Overview

PlateX is a comprehensive, AI-powered nutrition platform that combines cutting-edge vision AI with personalized diet tracking to help users achieve their health goals.

### 🤖 AI-Powered Food Analysis
- **Smart Image Analysis**: Upload a photo of your meal and get instant nutritional breakdown using Google Gemini Vision AI
- **Ingredient Detection**: Automatically identifies ingredients with portion estimates
- **Barcode Scanner**: Quick food logging by scanning product barcodes (OpenFoodFacts integration)
- **Blood Sugar Impact**: Visual chart showing predicted glycemic response

### 📊 Comprehensive Nutrition Tracking
- **Macro Tracking**: Real-time tracking of calories, protein, carbs, and fat with visual progress rings
- **Health Score**: Each meal receives an AI-generated health score (1-10)
- **Historical Logs**: View past meals with full nutritional details
- **Weekly Reports**: Generate downloadable PDF/image reports of your nutrition stats

### 🥗 Intelligent Meal Planning
- **AI Diet Planner**: Generate personalized meal plans based on your profile and goals
- **Weekly Meal Prep**: Get a full week of meal suggestions with automated shopping list generation
- **Chef AI ("Clean the Fridge")**: Input ingredients you have, and AI suggests recipes to use them up
- **Recipe Generation**: Get detailed recipes with prep time, ingredients, and step-by-step instructions

### 💧 Wellness Tracking
- **Hydration Tracker**: Track daily water intake with animated progress visualization
- **Streak Counter**: Maintain logging streaks with motivational tracking
- **Food Mood Tracker**: Log how foods make you feel for personalized insights
- **Body Progress Photos**: Secure gallery for weekly progress photos with comparison view

### 🏆 Gamification & Engagement
- **Trophy Room**: Unlock achievement badges for healthy habits
  - 🌅 **Early Bird** - Log breakfast before 9 AM
  - 💧 **Hydration Hero** - Maintain water logging streak
  - 🔥 **Streak Master** - Maintain consecutive day logging streak
- **Level System**: Progress through levels as you maintain healthy habits
- **Streak Bonuses**: Earn bonus points for maintaining streaks
- **Challenges & Quests**: Daily and weekly health challenges

### 💬 AI Assistant
- **Floating Chat Widget**: 24/7 AI nutrition assistant powered by Groq
- **Diet Advice**: Get personalized answers to nutrition questions
- **Meal Suggestions**: Ask for meal ideas based on dietary restrictions

### 👤 User Profile & Personalization
- **Health Profile**: Set age, weight, height, activity level, and goals
- **Allergy Management**: Track food allergies and sensitivities
- **Medical Conditions**: Account for conditions like diabetes, PCOS, thyroid issues
- **Custom Macro Targets**: Auto-calculated or manually set daily goals
- **Water Goals**: Personalized daily hydration targets

### 👨‍⚕️ Professional Support
- **Nutritionist Directory**: Browse and connect with certified nutritionists
- **Consultation Booking**: Schedule video consultations (Premium feature)
- **Expert Ratings & Reviews**: See nutritionist ratings and specialties

### 💎 Premium Features
- Unlimited meal analysis
- Advanced AI meal planning
- Priority nutritionist access
- Detailed analytics and insights
- Ad-free experience

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | TailwindCSS v4, Framer Motion, Glassmorphism UI |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei |
| **Backend** | Next.js API Routes, Server Components |
| **Database** | Supabase (PostgreSQL), Row Level Security |
| **File Storage** | Supabase Storage |
| **AI/ML** | Google Gemini Vision (gemini-1.5-flash), Groq (LLaMA) |
| **Charts** | Recharts |
| **Barcode** | html5-qrcode, OpenFoodFacts API |
| **Utilities** | html2canvas (screenshots), lucide-react (icons) |

---

## 📁 Project Structure

```
PlateX/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/                      # API routes
│   │   │   ├── analyze/              # Food image analysis (Gemini)
│   │   │   ├── barcode/              # Barcode lookup (OpenFoodFacts)
│   │   │   ├── chat/                 # AI chat assistant (Groq)
│   │   │   ├── planner/              # Diet plan generation
│   │   │   ├── suggest-recipe/       # Recipe suggestions
│   │   │   ├── weekly-meal-plan/     # Weekly meal prep generation
│   │   │   ├── weekly-report/        # Report generation
│   │   │   ├── save-recipe/          # Save recipes to DB
│   │   │   └── log-voice/            # Voice logging (future)
│   │   ├── fridge/                   # Chef AI - ingredient-based recipes
│   │   ├── login/                    # Authentication
│   │   ├── signup/                   # User registration
│   │   ├── meal-prep/                # Weekly meal preparation
│   │   ├── nutritionist/             # Nutritionist directory
│   │   ├── planner/                  # Diet planner
│   │   ├── premium/                  # Premium subscription
│   │   ├── profile/                  # User profile & settings
│   │   ├── progress/                 # Progress photos & tracking
│   │   ├── report/                   # Weekly reports
│   │   ├── settings/                 # App settings
│   │   ├── shopping-list/            # Shopping list management
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Dashboard/Home
│   │
│   ├── components/                   # React components
│   │   ├── AIChatAssistant.tsx       # Floating AI chat widget
│   │   ├── AnalyticsChart.tsx        # Analytics visualizations
│   │   ├── AuthProvider.tsx          # Authentication context
│   │   ├── BarcodeScanner.tsx        # Barcode scanning modal
│   │   ├── BloodSugarChart.tsx       # Glycemic response chart
│   │   ├── CalendarView.tsx          # Meal calendar
│   │   ├── ChallengesQuests.tsx      # Gamification challenges
│   │   ├── ChatAssistant.tsx         # Alternative chat UI
│   │   ├── ComparisonView.tsx        # Progress photo comparison
│   │   ├── FoodMoodTracker.tsx       # Food-mood correlation
│   │   ├── HistoryList.tsx           # Food log history
│   │   ├── HydrationTracker.tsx      # Water intake tracker
│   │   ├── LevelSystem.tsx           # User leveling system
│   │   ├── LoginBackground.tsx       # Animated login background
│   │   ├── MacroDonut.tsx            # Donut chart for macros
│   │   ├── MacroProgressRings.tsx    # Circular progress rings
│   │   ├── ResultsCard.tsx           # Food analysis results
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   ├── StreakBonus.tsx           # Streak bonus display
│   │   ├── StreakCounter.tsx         # Streak tracking UI
│   │   ├── ThemeToggle.tsx           # Dark/light mode toggle
│   │   ├── ThreeBackground.tsx       # 3D animated background
│   │   ├── TrophyRoom.tsx            # Achievement badges
│   │   ├── UploadCard.tsx            # Image upload component
│   │   └── WeeklyReportCard.tsx      # Weekly report summary
│   │
│   ├── lib/
│   │   └── supabaseClient.ts         # Supabase client config
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   │
│   └── middleware.ts                 # Auth middleware
│
├── public/                           # Static assets
├── supabase_schema.sql              # Main database schema
├── supabase_progress.sql            # Progress photos schema
├── supabase_saved_recipes.sql       # Saved recipes schema
├── supabase_shopping_list.sql       # Shopping list schema
├── supabase_water.sql               # Water logs schema
└── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI API key (Gemini)
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PlateX.git
   cd PlateX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # AI APIs
   GEMINI_API_KEY=your_google_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Set up Supabase database**
   
   Run these SQL scripts in your Supabase SQL Editor (in order):
   - `supabase_schema.sql` - Main schema (profiles, food_logs)
   - `supabase_water.sql` - Water tracking
   - `supabase_progress.sql` - Progress photos
   - `supabase_saved_recipes.sql` - Saved recipes
   - `supabase_shopping_list.sql` - Shopping list

5. **Set up Supabase Storage**
   
   Create the following storage buckets:
   - `scans` - For food photos (enable public access)
   - `progress` - For progress photos (private)

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📡 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Analyze food image with Gemini AI |
| `/api/barcode` | GET | Lookup product by barcode |
| `/api/chat` | POST | AI chat assistant (Groq) |
| `/api/planner` | POST | Generate personalized diet plan |
| `/api/suggest-recipe` | POST | Get recipe suggestions |
| `/api/weekly-meal-plan` | POST | Generate weekly meal plan |
| `/api/weekly-report` | POST | Generate weekly nutrition report |
| `/api/save-recipe` | POST | Save recipe to database |

---

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles with health data, goals, allergies
- **food_logs** - All food entries with nutritional data
- **water_logs** - Hydration tracking entries
- **progress_photos** - Body progress photo metadata
- **saved_recipes** - User's saved recipes
- **shopping_list** - Shopping list items

---

## 🎨 UI/UX Features

- **Dark Mode First**: Premium dark theme with glassmorphism effects
- **3D Animated Background**: WebGL-powered particle animations
- **Responsive Design**: Fully mobile-responsive with slide-out navigation
- **Micro-animations**: Smooth transitions powered by Framer Motion
- **Skeleton Loading**: Elegant loading states throughout
- **Toast Notifications**: Non-intrusive feedback for user actions

---

## 🔒 Security

- **Row Level Security (RLS)**: All Supabase tables protected with RLS policies
- **Authenticated Routes**: Protected pages require authentication
- **Secure File Uploads**: Signed URLs for file access
- **API Rate Limiting**: Built-in protection against abuse

---

## 📱 Screenshots

| Dashboard | Food Analysis | Meal Prep |
|-----------|---------------|-----------|
| Main dashboard with macro tracking | AI-powered food analysis results | Weekly meal planning |

| Profile | Progress | Trophy Room |
|---------|----------|-------------|
| Health profile settings | Progress photo tracking | Achievement badges |

---

## 🗺️ Roadmap

- [ ] Voice-based food logging
- [ ] Apple Health / Google Fit integration
- [ ] Social features (share meals, challenges)
- [ ] Restaurant menu scanning
- [ ] AI-powered grocery recommendations
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) for vision AI
- [Groq](https://groq.com/) for fast LLM inference
- [Supabase](https://supabase.com/) for backend infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [OpenFoodFacts](https://world.openfoodfacts.org/) for barcode data

---

<p align="center">
  Made with ❤️ by PlateX Team
</p>
