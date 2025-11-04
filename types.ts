import type { ReactElement } from 'react';

export type Page = 'dashboard' | 'order-list' | 'create-order' | 'service-1' | 'service-2' | 'service-3' | 'service-4' | 'service-5' | 'my-list' | 'profile' | 'recharge' | 'admin-dashboard' | 'manage-services' | 'user-management' | 'settings' | 'admin-preview';

export interface Order {
    id: string;
    service: string;
    type: string;
    identifier: string;
    note?: string;
    status: 'সফল' | 'বিফল' | 'পেন্ডিং';
    date: string;
    userName?: string;
    userId: string;
    price: number;
    fileData?: string; // For storing base64 encoded PDF
}

export interface Service {
    id: string;
    name: string;
    status: 'চালু' | 'বন্ধ';
    icon: ReactElement;
    price: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    phone?: string;
    password?: string;
    role: 'admin' | 'user';
}

export interface Transaction {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    type: 'recharge';
    method: 'bKash';
    date: string;
    status: 'সফল';
}

export interface Settings {
    siteName: string;
    logo: string; // base64 encoded image
    geminiApiKey: string;
    telegramBotToken: string;
    telegramChatId: string;
}