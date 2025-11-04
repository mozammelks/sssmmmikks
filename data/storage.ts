import React from 'react';
import { Service, Order, User, Settings, Transaction } from '../types';

const CheckCircleIcon = (): React.ReactElement => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }));
const XCircleIcon = (): React.ReactElement => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }));

type StoredService = Omit<Service, 'icon'>;

const initialServices: StoredService[] = [
    { id: 's1', name: 'নতুন এনআইডি', status: 'চালু', price: 200 },
    { id: 's2', name: 'সার্ভার কপি আপডেটেড', status: 'চালু', price: 50 },
    { id: 's3', name: 'টিন সার্টিফিকেট', status: 'চালু', price: 80 },
    { id: 's4', name: 'নতুন জন্ম নিবন্ধন', status: 'চালু', price: 120 },
    { id: 's5', name: 'সার্ভার টু মাস্টার কপি', status: 'চালু', price: 300 },
    { id: 's6', name: 'স্মার্ট কার্ড PDF', status: 'চালু', price: 150 },
    { id: 's7', name: 'বায়োমেট্রিক', status: 'চালু', price: 500 },
    { id: 's12', name: 'সার্ভার কপি (পুরাতন)', status: 'বন্ধ', price: 40 },
    { id: 's13', name: 'আইডি কার্ড', status: 'চালু', price: 100 },
];

const initialUsers: User[] = [
    { id: 'u1', name: 'Mozammel.ks', email: 'admin@example.com', balance: 1363, phone: '01705144099', password: 'admin', role: 'admin' },
    { id: 'u2', name: 'user2', email: 'user@example.com', balance: 300.00, password: 'user', role: 'user' },
    { id: 'u3', name: 'user3', email: 'user3@example.com', balance: 750.50, password: 'user3', role: 'user' },
];

const initialOrders: Order[] = [
    { id: '1', service: 'সার্ভার কপি', type: 'Voter No', identifier: '611324784241', note: 'জরুরী প্রয়োজন', status: 'সফল', date: new Date('2023-03-27T21:49:00').toISOString(), userName: 'Mozammel.ks', userId: 'u1', price: 45, fileData: '' },
    { id: '2', service: 'সার্ভার কপি', type: 'NID No', identifier: '6592296801', note: '', status: 'সফল', date: new Date('2023-03-26T17:12:00').toISOString(), userName: 'Mozammel.ks', userId: 'u1', price: 45, fileData: '' },
    { id: '3', service: 'আইডি কার্ড', type: 'NID No', identifier: '8934759834', note: '', status: 'পেন্ডিং', date: new Date('2023-03-28T11:00:00').toISOString(), userName: 'user2', userId: 'u2', price: 100 },
    { id: '4', service: 'স্মার্ট কার্ড PDF', type: 'Voter No', identifier: '1234567890', note: 'ডেলিভারি দ্রুত করুন', status: 'বিফল', date: new Date('2023-03-28T14:30:00').toISOString(), userName: 'user3', userId: 'u3', price: 150 },
];

const initialTransactions: Transaction[] = [];

const defaultSettings: Settings = {
    siteName: 'সার্ভিস পয়েন্ট',
    logo: '',
    geminiApiKey: '',
    telegramBotToken: '',
    telegramChatId: ''
};

const SERVICES_KEY = 'app_services';
const ORDERS_KEY = 'app_orders';
const USERS_KEY = 'app_users';
const TRANSACTIONS_KEY = 'app_transactions';
const SETTINGS_KEY = 'app_settings';
const LOGGED_IN_USER_KEY = 'app_logged_in_user';

const getServices = (): Service[] => {
    try {
        const stored = localStorage.getItem(SERVICES_KEY);
        if (stored) {
            const parsed: StoredService[] = JSON.parse(stored);
            return parsed.map(s => ({...s, icon: s.status === 'চালু' ? CheckCircleIcon() : XCircleIcon()}));
        }
    } catch (e) {
        console.error("Failed to parse services from localStorage", e);
    }
    // Initialize if not present
    localStorage.setItem(SERVICES_KEY, JSON.stringify(initialServices));
    return initialServices.map(s => ({...s, icon: s.status === 'চালু' ? CheckCircleIcon() : XCircleIcon()}));
};

const saveServices = (services: Service[]) => {
    const toStore: StoredService[] = services.map(({icon, ...rest}) => rest);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(toStore));
};

const getOrders = (): Order[] => {
    try {
        const stored = localStorage.getItem(ORDERS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
    }
    // Initialize if not present
    localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
    return initialOrders;
}

const saveOrders = (orders: Order[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};


const getUsers = (): User[] => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch(e) {
        console.error("Failed to parse users from localStorage", e);
    }
    // Initialize if not present
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const getTransactions = (): Transaction[] => {
    try {
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse transactions from localStorage", e);
    }
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
    return initialTransactions;
};

const saveTransactions = (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};


const getSettings = (): Settings => {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
            return { ...defaultSettings, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
    }
    // Initialize if not present
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
};

const saveSettings = (settings: Settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Auth & Session ---
const getLoggedInUser = (): User | null => {
    try {
        const stored = sessionStorage.getItem(LOGGED_IN_USER_KEY);
        if (stored) {
            const user = JSON.parse(stored);
            // Re-fetch from main users list to ensure data is fresh
            const allUsers = getUsers();
            return allUsers.find(u => u.id === user.id) || null;
        }
    } catch (e) {
        console.error("Failed to parse logged in user from sessionStorage", e);
    }
    return null;
};

const setLoggedInUser = (user: User) => {
    sessionStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
};

const clearLoggedInUser = () => {
    sessionStorage.removeItem(LOGGED_IN_USER_KEY);
};

const loginUser = (email: string, password_raw: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password_raw);
    return user || null;
};

const registerUser = (name: string, email: string, phone: string, password_raw: string): User | null => {
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return null; // User already exists
    }
    const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        phone,
        password: password_raw,
        role: 'user',
        balance: 0,
    };
    const updatedUsers = [newUser, ...users];
    saveUsers(updatedUsers);
    return newUser;
};

export { getServices, saveServices, getOrders, saveOrders, getUsers, saveUsers, getTransactions, saveTransactions, getSettings, saveSettings, getLoggedInUser, setLoggedInUser, clearLoggedInUser, loginUser, registerUser };
