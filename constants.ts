import React, { useState } from 'react';
import { getServices, getOrders, saveOrders, getSettings } from './data/storage';
import { Page, Order, User } from './types';
import { sendTelegramNotification } from './services/notificationService';
import { GoogleGenAI } from '@google/genai';


const Breadcrumb = () => (
    React.createElement("div", { className: "text-sm text-gray-500 mb-4" },
        React.createElement("span", null, "🏠 ড্যাশবোর্ড"),
        React.createElement("span", { className: "mx-2" }, "›"),
        React.createElement("span", null, "আমার অর্ডারসমূহ"),
        React.createElement("span", { className: "mx-2" }, "›"),
        React.createElement("span", { className: "text-gray-800" }, "অর্ডার তৈরি")
    )
);

interface CreateOrderProps {
    setActivePage: (page: Page) => void;
    currentUser: User;
}


const CreateOrder: React.FC<CreateOrderProps> = ({ setActivePage, currentUser }) => {
    const availableServices = getServices().filter(s => s.status === 'চালু');
    
    const [selectedServiceId, setSelectedServiceId] = useState<string>(availableServices.length > 0 ? availableServices[0].id : '');
    const [identifier, setIdentifier] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('NID No');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleSuggestNote = async () => {
        const settings = getSettings();
        if (!settings.geminiApiKey) {
            setError('Gemini API কী সেট করা নেই। অনুগ্রহ করে অ্যাডমিন সেটিংস থেকে যোগ করুন।');
            return;
        }
        
        const selectedService = availableServices.find(s => s.id === selectedServiceId);
        if (!selectedService) {
            setError('অনুগ্রহ করে প্রথমে একটি সেবা নির্বাচন করুন।');
            return;
        }

        setIsSuggesting(true);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: settings.geminiApiKey });
            const prompt = `Write a short, polite, one-sentence note in Bengali for a service request. The service is "${selectedService.name}". The note should be addressed to the service provider, for example: ' কাজটি দ্রুত করে দিলে উপকৃত হতাম।'. Keep it concise.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;
            setNote(text);

        } catch (err) {
            console.error("Gemini API error:", err);
            setError('নোট সাজেস্ট করার সময় একটি সমস্যা হয়েছে।');
        } finally {
            setIsSuggesting(false);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedServiceId || !identifier.trim()) {
            setError('অনুগ্রহ করে সকল আবশ্যক ঘর পূরণ করুন।');
            return;
        }
        setError('');
        setIsSubmitting(true);
        
        const service = availableServices.find(s => s.id === selectedServiceId);
        if (!service) {
            setError('অবৈধ সেবা নির্বাচন করা হয়েছে।');
            setIsSubmitting(false);
            return;
        }

        const newOrder: Order = {
            id: `o${Date.now()}`,
            service: service.name,
            type: type,
            identifier: identifier.trim(),
            note: note.trim(),
            status: 'পেন্ডিং',
            date: new Date().toISOString(),
            userName: currentUser.name,
            userId: currentUser.id,
            price: service.price,
        };
        
        // Simulate network delay
        setTimeout(() => {
            const allOrders = getOrders();
            saveOrders([newOrder, ...allOrders]);
            
            // Send notification
            sendTelegramNotification(newOrder)
                .then(() => console.log("Telegram notification sent successfully."))
                .catch(err => console.error("Failed to send Telegram notification:", err));

            setIsSubmitting(false);
            setActivePage('order-list');
        }, 1000);
    };


    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl font-bold text-gray-800 mb-2" }, "নতুন অর্ডার তৈরি করুন"),
            React.createElement(Breadcrumb, null),
            React.createElement("div", { className: "bg-white p-8 rounded-lg shadow-md mt-6" },
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
                    React.createElement("div", { className: "w-full md:w-2/3" },
                        React.createElement("label", { htmlFor: "service", className: "block text-gray-700 font-medium mb-2" }, "সেবা ", React.createElement("span", { className: "text-red-500" }, "*")),
                        React.createElement("select", { 
                            id: "service", 
                            value: selectedServiceId,
                            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedServiceId(e.target.value),
                            className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                            disabled: isSubmitting
                        },
                            availableServices.map((service) => (
                                React.createElement("option", { key: service.id, value: service.id }, `${service.name} - ${service.price.toFixed(2)} টাকা`)
                            ))
                        )
                    ),
                    React.createElement("div", { className: "w-full md:w-2/3" },
                        React.createElement("label", { htmlFor: "type", className: "block text-gray-700 font-medium mb-2" }, "ধরন ", React.createElement("span", { className: "text-red-500" }, "*")),
                         React.createElement("select", { 
                            id: "type", 
                            value: type,
                            // FIX: Explicitly type the event parameter 'e' to resolve overload error.
                            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value),
                            className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                            disabled: isSubmitting
                        },
                            React.createElement("option", { value: "NID No" }, "NID No"),
                            React.createElement("option", { value: "Voter No" }, "Voter No"),
                            React.createElement("option", { value: "Birth Certificate No" }, "Birth Certificate No"),
                            React.createElement("option", { value: "Passport No" }, "Passport No")
                        )
                    ),
                    React.createElement("div", { className: "w-full md:w-2/3" },
                        React.createElement("label", { htmlFor: "identifier", className: "block text-gray-700 font-medium mb-2" }, "এসোসিয়েটেড নাম্বার/ডকুমেন্ট ", React.createElement("span", { className: "text-red-500" }, "*")),
                        React.createElement("input", { 
                            type: "text",
                            id: "identifier", 
                            value: identifier,
                            // FIX: Explicitly type the event parameter 'e' to resolve overload error.
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value),
                            placeholder: "এখানে নাম্বার/ডকুমেন্ট লিখুন...",
                            className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                            disabled: isSubmitting
                         })
                    ),
                    React.createElement("div", { className: "w-full md:w-2/3" },
                        React.createElement("label", { htmlFor: "note", className: "block text-gray-700 font-medium mb-2" }, "নোট (ঐচ্ছিক)"),
                        React.createElement("textarea", { 
                            id: "note", 
                            value: note,
                            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value),
                            placeholder: "অর্ডার সম্পর্কে কোনো বিশেষ নির্দেশনা থাকলে এখানে লিখুন...",
                            className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                            rows: 3,
                            disabled: isSubmitting || isSuggesting
                         }),
                        React.createElement("button", {
                            type: "button",
                            onClick: handleSuggestNote,
                            className: "mt-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors",
                            disabled: isSuggesting || isSubmitting || !selectedServiceId
                        }, isSuggesting ? 'সাজেস্ট করা হচ্ছে...' : '✨ নোট সাজেস্ট করুন')
                    ),
                    error && React.createElement("p", {className: "text-red-500 text-sm"}, error),
                    React.createElement("div", null,
                        React.createElement("button", { type: "submit", className: "px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400", disabled: isSubmitting || isSuggesting },
                           isSubmitting ? 'সাবমিট হচ্ছে...' : 'অর্ডার সাবমিট করুন'
                        )
                    )
                )
            )
        )
    );
};

export default CreateOrder;