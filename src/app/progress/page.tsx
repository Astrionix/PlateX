'use client';

import { useState, useEffect } from 'react';
import ThreeBackground from '@/components/ThreeBackground';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Camera, Trash2, Plus, Loader2 } from 'lucide-react';
import FoodMoodTracker from '@/components/FoodMoodTracker';
import ComparisonView from '@/components/ComparisonView';

export default function Progress() {
    const { user, loading: authLoading } = useAuth();
    const [photos, setPhotos] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [weight, setWeight] = useState('');

    useEffect(() => {
        if (user) fetchPhotos();
    }, [user]);

    const fetchPhotos = async () => {
        const { data } = await supabase
            .from('progress_photos')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });
        if (data) setPhotos(data);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user) return;
        setUploading(true);

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        try {
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('Platex')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('Platex')
                .getPublicUrl(fileName);

            // 3. Save to DB
            const { error: dbError } = await supabase.from('progress_photos').insert({
                user_id: user.id,
                image_url: publicUrl,
                weight_kg: weight ? parseFloat(weight) : null,
                notes: ''
            });

            if (dbError) throw dbError;

            fetchPhotos();
            setWeight('');
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const deletePhoto = async (id: string, path: string) => {
        // Simplified delete (just DB row for now, theoretically should clean storage too)
        await supabase.from('progress_photos').delete().eq('id', id);
        fetchPhotos();
    };

    // Calculate Progress (Latest - Oldest)
    const startWeight = photos.length > 0 ? photos[photos.length - 1].weight_kg : 0;
    const currentWeight = photos.length > 0 ? photos[0].weight_kg : 0;
    const diff = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : 0;

    return (
        <div className="flex min-h-screen relative text-white overflow-hidden">
            <ThreeBackground />
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen relative z-10">
                <div className="w-full max-w-5xl mx-auto pt-8">
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">Body Timeline</h2>
                            <p className="text-gray-400">Visualize your journey.</p>
                        </div>
                        {startWeight > 0 && (
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Total Change</p>
                                <p className={`text-2xl font-bold ${Number(diff) <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {Number(diff) > 0 ? '+' : ''}{diff} kg
                                </p>
                            </div>
                        )}
                    </header>

                    {/* Analytics Row */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <FoodMoodTracker />
                        <ComparisonView />
                    </div>

                    {/* Upload Section */}
                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 w-full relative group">
                            <label className="flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-pointer">
                                <div className="text-center text-gray-400 group-hover:text-purple-400">
                                    {uploading ? <Loader2 className="mx-auto animate-spin mb-2" /> : <Camera className="mx-auto mb-2" size={32} />}
                                    <p className="font-bold">{uploading ? 'Uploading...' : 'Add Progress Photo'}</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                            </label>
                        </div>
                        <div className="w-full md:w-64">
                            <label className="block text-sm text-gray-400 mb-2">Current Weight (Optional)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 75.5"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                                />
                                <span className="absolute right-4 top-3.5 text-gray-500 font-bold">kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {photos.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <Camera size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No photos yet. Start your timeline today!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map((photo) => (
                                <div key={photo.id} className="relative group bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                                    <div className="aspect-[3/4] relative">
                                        <img src={photo.image_url} alt="Progress" className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                            <p className="font-bold text-white">{new Date(photo.created_at).toLocaleDateString()}</p>
                                            {photo.weight_kg && <p className="text-purple-400 text-sm font-medium">{photo.weight_kg} kg</p>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deletePhoto(photo.id, photo.image_url)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
