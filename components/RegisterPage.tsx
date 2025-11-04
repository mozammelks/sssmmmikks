import React, { useState } from 'react';
import { getSettings } from '../data/storage';

interface RegisterPageProps {
    onRegister: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
    onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const settings = getSettings();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 4) {
            setError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
            return;
        }
        setError('');
        setIsLoading(true);
        const success = await onRegister(name, email, phone, password);
        if (!success) {
            setError('এই ইমেইল দিয়ে ইতিমধ্যে রেজিস্টার করা হয়েছে।');
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
                    <p className="text-gray-500 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">নাম</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ইমেইল</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ফোন নম্বর</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">পাসওয়ার্ড</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <button type="submit" className="w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400" disabled={isLoading}>
                                {isLoading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}
                            </button>
                        </div>
                    </form>
                     <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                            <button onClick={onNavigateToLogin} className="text-blue-600 hover:underline font-medium">
                                লগইন করুন
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
