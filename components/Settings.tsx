import React, { useState } from 'react';
import { Settings } from '../types';

interface SettingsProps {
    currentSettings: Settings;
    onSave: (newSettings: Settings) => void;
}

const SettingsComponent: React.FC<SettingsProps> = ({ currentSettings, onSave }) => {
    const [settings, setSettings] = useState<Settings>(currentSettings);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(settings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">সাইট সেটিংস</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* General Settings */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">সাধারণ সেটিংস</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="siteName" className="block text-gray-700 font-medium mb-2">সাইটের নাম</label>
                                <input type="text" id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="logo" className="block text-gray-700 font-medium mb-2">সাইটের লোগো</label>
                                <input type="file" id="logo" name="logo" onChange={handleLogoChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                {settings.logo && <img src={settings.logo} alt="Logo Preview" className="mt-4 h-16 rounded-md bg-gray-100 p-2" />}
                            </div>
                        </div>
                    </div>

                    {/* API Settings */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">API সেটিংস</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="geminiApiKey" className="block text-gray-700 font-medium mb-2">Gemini API কী</label>
                                <input type="password" id="geminiApiKey" name="geminiApiKey" value={settings.geminiApiKey} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 border rounded-md" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Telegram Settings */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">টেলিগ্রাম নোটিফিকেশন</h2>
                         <div className="space-y-4">
                            <div>
                                <label htmlFor="telegramBotToken" className="block text-gray-700 font-medium mb-2">টেলিগ্রাম বট টোকেন</label>
                                <input type="text" id="telegramBotToken" name="telegramBotToken" value={settings.telegramBotToken} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 border rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="telegramChatId" className="block text-gray-700 font-medium mb-2">টেলিগ্রাম চ্যাট আইডি</label>
                                <input type="text" id="telegramChatId" name="telegramChatId" value={settings.telegramChatId} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 border rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center space-x-4 pt-4 border-t">
                        <button type="submit" className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">সংরক্ষণ করুন</button>
                        {showSuccess && (
                            <div className="text-green-600 font-medium flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                সফলভাবে সংরক্ষণ করা হয়েছে!
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsComponent;
