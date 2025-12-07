'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Save, User, Activity, Target, Scale, Ruler, AlertTriangle, HeartPulse, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { Profile as ProfileType } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';

const TrophyRoom = dynamic(() => import('@/components/TrophyRoom'), { ssr: false });
const LevelSystem = dynamic(() => import('@/components/LevelSystem'), { ssr: false });
const StreakBonus = dynamic(() => import('@/components/StreakBonus'), { ssr: false });

const ALLERGIES_LIST = ['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy', 'Eggs'];
const CONDITIONS_LIST = ['Diabetes', 'PCOS', 'Thyroid', 'Hypertension', 'High Cholesterol'];

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    const [loadingData, setLoadingData] = useState(false);

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
    const [authError, setAuthError] = useState('');
    const [authLoadingState, setAuthLoadingState] = useState(false);

    const [profile, setProfile] = useState<ProfileType & { id?: string }>({
        name: '',
        age: 0,
        gender: 'male',
        height: 0,
        weight: 0,
        activityLevel: 'moderate',
        goal: 'maintenance',
        preference: 'omnivore',
        allergies: [],
        medicalConditions: [],
        dailyTargets: {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fat: 65,
            water: 2.5
        }
    });
    const [saved, setSaved] = useState(false);

    // Initial Load
    useEffect(() => {
        if (!authLoading && user) {
            fetchProfile();
        } else if (!authLoading && !user) {
            // Try local storage as fallback/guest mode
            const savedProfile = localStorage.getItem('platex_profile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
        }
    }, [user, authLoading]);

    // Auto-calculate targets whenever stats change
    useEffect(() => {
        // Only run if we have some data
        if (profile.weight && profile.height && profile.age && profile.gender) {
            calculateTargets();
        }
    }, [profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel, profile.goal]);

    const fetchProfile = async () => {
        if (!user) return;
        setLoadingData(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_uid', user.id)
                .maybeSingle();

            if (data) {
                // Map DB keys to frontend keys if they differ, or rely on consistency
                // DB uses snake_case, frontend uses camelCase. We must map!
                const loadedProfile: ProfileType & { id?: string } = {
                    id: data.id,
                    name: data.display_name || '',
                    age: data.age || 0,
                    gender: data.gender || 'male',
                    height: data.height_cm || 0,
                    weight: data.weight_kg || 0,
                    activityLevel: data.activity_level || 'moderate',
                    goal: data.goal || 'maintenance',
                    preference: data.dietary_preference || 'omnivore',
                    allergies: data.allergies || [],
                    medicalConditions: data.medical_conditions || [],
                    dailyTargets: {
                        calories: data.daily_calorie_target || 2000,
                        protein: data.daily_protein_target || 150,
                        carbs: data.daily_carbs_target || 250,
                        fat: data.daily_fat_target || 65,
                        water: data.daily_water_target || 2.5
                    }
                };
                setProfile(loadedProfile);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoadingState(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            }
        } catch (err: any) {
            setAuthError(err.message);
        } finally {
            setAuthLoadingState(false);
        }
    };

    const calculateTargets = () => {
        // Mifflin-St Jeor Equation
        let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
        bmr += profile.gender === 'male' ? 5 : -161;

        const activityMultipliers: Record<string, number> = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        let tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2);

        // Goal adjustment
        if (profile.goal === 'fat_loss') tdee -= 500;
        if (profile.goal === 'muscle_gain') tdee += 300;

        const calories = Math.round(tdee);

        // Macros (simplified split: 30% P, 40% C, 30% F for maintenance/gain, higher P for loss)
        let proteinRatio = 0.3;
        let fatRatio = 0.3;
        let carbsRatio = 0.4;

        if (profile.goal === 'fat_loss') {
            proteinRatio = 0.4;
            carbsRatio = 0.3;
            fatRatio = 0.3;
        } else if (profile.goal === 'muscle_gain') {
            proteinRatio = 0.3;
            carbsRatio = 0.45;
            fatRatio = 0.25;
        }

        const protein = Math.round((calories * proteinRatio) / 4);
        const carbs = Math.round((calories * carbsRatio) / 4);
        const fat = Math.round((calories * fatRatio) / 9);
        const water = Math.round((profile.weight * 0.033) * 10) / 10; // ~33ml per kg

        setProfile(prev => ({
            ...prev,
            dailyTargets: { calories, protein, carbs, fat, water }
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const toggleSelection = (field: 'allergies' | 'medicalConditions', item: string) => {
        setProfile(prev => {
            const list = prev[field] || [];
            if (list.includes(item)) {
                return { ...prev, [field]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [field]: [...list, item] };
            }
        });
        setSaved(false);
    };

    const handleSave = async () => {
        // Save to local storage always as backup
        localStorage.setItem('platex_profile', JSON.stringify(profile));

        if (user) {
            // Upsert to Supabase
            const dbData = {
                auth_uid: user.id,
                display_name: profile.name,
                age: Number(profile.age),
                gender: profile.gender,
                height_cm: Number(profile.height),
                weight_kg: Number(profile.weight),
                activity_level: profile.activityLevel,
                goal: profile.goal,
                dietary_preference: profile.preference,
                allergies: profile.allergies,
                medical_conditions: profile.medicalConditions,
                daily_calorie_target: profile.dailyTargets?.calories || 0,
                daily_protein_target: profile.dailyTargets?.protein || 0,
                daily_carbs_target: profile.dailyTargets?.carbs || 0,
                daily_fat_target: profile.dailyTargets?.fat || 0,
                daily_water_target: profile.dailyTargets?.water || 0,
                updated_at: new Date().toISOString()
            };

            try {
                let query = supabase.from('profiles');
                let result;

                // First check if a profile already exists for this user to avoid duplicates if ID is missing in state
                const { data: existing } = await supabase.from('profiles').select('id').eq('auth_uid', user.id).single();

                if (existing) {
                    result = await query.update(dbData).eq('id', existing.id).select();
                } else {
                    result = await query.insert(dbData).select();
                }

                if (result.error) throw result.error;

                if (result.data && result.data[0]) {
                    setProfile(prev => ({ ...prev, id: result.data[0].id }));
                }
            } catch (err) {
                console.error("Save error:", err);
                alert("Failed to save to cloud.");
            }
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (authLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;
    }

    // IF NOT LOGGED IN, SHOW LOGIN GATE (But still allow viewing/editing as Guest backed by LocalStorage?)
    // User requested "Sync... to Supabase". So we should encourage Login.
    const showLoginGate = !user;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen">
                <div className="w-full max-w-4xl mx-auto pt-8">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
                            <p className="text-gray-400">
                                {user ? ' synced with cloud' : ' stored locally (Sign in to sync)'}
                            </p>
                        </div>
                    </header>

                    {showLoginGate && (
                        <div className="mb-8 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><LogIn className="text-blue-400" /> Sync your Data</h3>
                                    <p className="text-gray-400 text-sm mb-4">Sign in to save your profile and diet plans to the cloud, accessible from any device.</p>

                                    <form onSubmit={handleAuth} className="space-y-3 max-w-sm">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full bg-gray-900/80 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="w-full bg-gray-900/80 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none"
                                                required
                                            />
                                        </div>
                                        {authError && <p className="text-red-400 text-xs">{authError}</p>}
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={authLoadingState}
                                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                                            >
                                                {authLoadingState ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : (isLogin ? 'Sign In' : 'Sign Up')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(!isLogin)}
                                                className="text-gray-400 hover:text-white text-xs underline px-2"
                                            >
                                                {isLogin ? 'Need an account?' : 'Have an account?'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                {/* Note removed */}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Row 1: Profile Header Card */}
                        <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-600 focus:border-blue-500 text-white focus:outline-none transition-all pb-1 w-full md:w-auto"
                                        placeholder="Your Name"
                                    />
                                    <p className="text-gray-400 mt-1">
                                        {user ? `✓ Cloud synced • ${user.email}` : '⚠️ Stored locally'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
                                >
                                    <Save size={18} />
                                    {saved ? 'Saved!' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-xl p-4">
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={profile.age || ''}
                                    onChange={handleChange}
                                    className="text-2xl font-bold bg-transparent text-white focus:outline-none w-full"
                                    placeholder="25"
                                />
                            </div>
                            <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-xl p-4">
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    className="text-xl font-bold bg-transparent text-white focus:outline-none w-full capitalize"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-xl p-4">
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Height</label>
                                <div className="flex items-baseline gap-1">
                                    <input
                                        type="number"
                                        name="height"
                                        value={profile.height || ''}
                                        onChange={handleChange}
                                        className="text-2xl font-bold bg-transparent text-white focus:outline-none w-20"
                                        placeholder="175"
                                    />
                                    <span className="text-gray-500 text-sm">cm</span>
                                </div>
                            </div>
                            <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-xl p-4">
                                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Weight</label>
                                <div className="flex items-baseline gap-1">
                                    <input
                                        type="number"
                                        name="weight"
                                        value={profile.weight || ''}
                                        onChange={handleChange}
                                        className="text-2xl font-bold bg-transparent text-white focus:outline-none w-20"
                                        placeholder="70"
                                    />
                                    <span className="text-gray-500 text-sm">kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Goals + Daily Targets */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Goals Card */}
                            <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="text-purple-400" size={20} /> Goals & Lifestyle
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Activity Level</label>
                                        <select
                                            name="activityLevel"
                                            value={profile.activityLevel}
                                            onChange={handleChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="sedentary">Sedentary</option>
                                            <option value="light">Light Active</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="active">Active</option>
                                            <option value="very_active">Very Active</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Dietary Goal</label>
                                        <select
                                            name="goal"
                                            value={profile.goal}
                                            onChange={handleChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="fat_loss">Fat Loss</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="muscle_gain">Muscle Gain</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Diet Preference</label>
                                        <select
                                            name="preference"
                                            value={profile.preference}
                                            onChange={handleChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="omnivore">No Restrictions</option>
                                            <option value="vegetarian">Vegetarian</option>
                                            <option value="vegan">Vegan</option>
                                            <option value="keto">Keto</option>
                                            <option value="paleo">Paleo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Targets Card */}
                            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="text-blue-400" size={20} /> Daily Targets
                                </h3>
                                <div className="text-center mb-4">
                                    <p className="text-4xl font-bold text-white">{profile.dailyTargets?.calories || 0}</p>
                                    <p className="text-gray-400 text-sm">kcal/day</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-gray-900/50 rounded-lg p-2">
                                        <p className="text-blue-400 text-xs font-bold">Protein</p>
                                        <p className="text-white font-bold">{profile.dailyTargets?.protein || 0}g</p>
                                    </div>
                                    <div className="bg-gray-900/50 rounded-lg p-2">
                                        <p className="text-yellow-400 text-xs font-bold">Carbs</p>
                                        <p className="text-white font-bold">{profile.dailyTargets?.carbs || 0}g</p>
                                    </div>
                                    <div className="bg-gray-900/50 rounded-lg p-2">
                                        <p className="text-red-400 text-xs font-bold">Fat</p>
                                        <p className="text-white font-bold">{profile.dailyTargets?.fat || 0}g</p>
                                    </div>
                                </div>
                                <div className="mt-4 bg-blue-500/10 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-200 text-xs">Water Goal</p>
                                        <p className="text-white font-bold">{profile.dailyTargets?.water || 0}L</p>
                                    </div>
                                    <Activity className="text-blue-400 opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Allergies & Conditions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-orange-400" /> Allergies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {ALLERGIES_LIST.map(item => (
                                        <button
                                            key={item}
                                            onClick={() => toggleSelection('allergies', item)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${profile.allergies?.includes(item)
                                                ? 'bg-orange-500/20 border-orange-500 text-orange-200'
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                                    <HeartPulse size={16} className="text-red-400" /> Medical Conditions
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {CONDITIONS_LIST.map(item => (
                                        <button
                                            key={item}
                                            onClick={() => toggleSelection('medicalConditions', item)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${profile.medicalConditions?.includes(item)
                                                ? 'bg-red-500/20 border-red-500 text-red-200'
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 5: Gamification */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <LevelSystem />
                            <StreakBonus currentStreak={7} />
                        </div>

                        {/* Row 6: Trophy Room */}
                        <TrophyRoom />
                    </div>
                </div>
            </main>
        </div>
    );
}
