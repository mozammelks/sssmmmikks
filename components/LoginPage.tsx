import React, { useState } from 'react';
import { getSettings } from '../data/storage';

interface LoginPageProps {
    onLogin: (email: string, pass: string) => Promise<boolean>;
    onNavigateToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const settings = getSettings();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await onLogin(email, password);
        if (!success) {
            setError('ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    {settings.logo ? (
                        <img src={settings.logo} alt="Site Logo" className="mx-auto h-16" />
                    ) : (
                        <h1 className="text-4xl font-bold text-gray-800">{settings.siteName}</h1>
                    )}
                    <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে লগইন করুন</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">ইমেইল</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">পাসওয়ার্ড</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            অ্যাকাউন্ট নেই?{' '}
                            <button onClick={onNavigateToRegister} className="text-blue-600 hover:underline font-medium">
                                রেজিস্টার করুন
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
