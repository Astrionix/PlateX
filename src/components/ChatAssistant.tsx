'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: "Hi! I'm your PlateX Coach. Ask me anything about your diet or the food you just scanned! 🥗" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // We could gather context from local storage or app state here if we had a global store
            // For now, let's grab the profile or last log if available in localStorage
            let context = {};
            const savedProfile = localStorage.getItem('platex_profile');
            if (savedProfile) context = { profile: JSON.parse(savedProfile) };

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, context })
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Try again later!" }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Oops, something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${pathname === '/login' ? 'hidden' : ''}`}>
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Bot size={20} />
                            <span>PlateX Coach</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-700' : 'bg-blue-600'}`}>
                                    {msg.role === 'user' ? <User size={14} className="text-gray-300" /> : <Bot size={14} className="text-white" />}
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-gray-800 text-white rounded-tr-none'
                                        : 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="px-4 py-2 rounded-2xl rounded-tl-none bg-blue-600/20 border border-blue-500/30 text-blue-100 text-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2 border border-gray-700 focus-within:border-blue-500 transition-colors"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about nutrition..."
                                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 ${isOpen ? 'bg-gray-700 text-gray-300' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}
