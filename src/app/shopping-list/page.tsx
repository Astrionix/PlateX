'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { ShoppingCart, Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';

interface ShoppingItem {
    id: string;
    item: string;
    is_checked: boolean;
}

export default function ShoppingList() {
    const { user } = useAuth();
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchItems();
    }, [user]);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('shopping_list')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (data) setItems(data);
        setLoading(false);
    };

    const addItem = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newItem.trim() || !user) return;

        const { data, error } = await supabase
            .from('shopping_list')
            .insert({ user_id: user.id, item: newItem.trim() })
            .select()
            .single();

        if (data) {
            setItems([data, ...items]);
            setNewItem('');
        }
    };

    const toggleCheck = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setItems(items.map(i => i.id === id ? { ...i, is_checked: !currentStatus } : i));

        await supabase
            .from('shopping_list')
            .update({ is_checked: !currentStatus })
            .eq('id', id);
    };

    const deleteItem = async (id: string) => {
        setItems(items.filter(i => i.id !== id));
        await supabase.from('shopping_list').delete().eq('id', id);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8">
                <div className="max-w-3xl mx-auto w-full pt-8">
                    <header className="mb-8 flex items-center gap-3">
                        <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                            <ShoppingCart size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Shopping List</h1>
                            <p className="text-gray-400">Manage your grocery essentials</p>
                        </div>
                    </header>

                    {!user ? (
                        <div className="text-center p-12 bg-gray-800/50 rounded-2xl border border-gray-700">
                            <p className="text-gray-400">Please sign in to manage your shopping list.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Add Item Form */}
                            <form onSubmit={addItem} className="relative">
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    placeholder="Add item (e.g., 'Almond Milk', 'Spinach')..."
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-4 pr-12 text-white focus:border-blue-500 focus:outline-none transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!newItem.trim()}
                                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Plus size={20} />
                                </button>
                            </form>

                            {/* List */}
                            {loading ? (
                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
                            ) : items.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    Your cart is empty. Start adding healthy foods! 🍎
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {items.map(item => (
                                        <div
                                            key={item.id}
                                            className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${item.is_checked
                                                    ? 'bg-gray-900/30 border-gray-800 opacity-60'
                                                    : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleCheck(item.id, item.is_checked)}>
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${item.is_checked ? 'bg-green-500 border-green-500 text-black' : 'border-gray-500'
                                                    }`}>
                                                    {item.is_checked && <Check size={14} strokeWidth={3} />}
                                                </div>
                                                <span className={`text-lg ${item.is_checked ? 'line-through text-gray-500' : 'text-white'}`}>
                                                    {item.item}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
