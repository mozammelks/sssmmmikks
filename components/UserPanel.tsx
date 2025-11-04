import React, { useState } from 'react';
import Sidebar from './Header';
import Dashboard from './StoryForm';
import OrderList from '../services/geminiService';
import CreateOrder from '../constants';
import RechargeComponent from './Recharge';
import AdminPreview from './AdminPreview';
import { Page, Settings, User } from '../types';
import { getSettings } from '../data/storage';

interface UserPanelProps {
    user: User;
    onLogout: () => void;
    onUserUpdate: (user: User) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ user, onLogout, onUserUpdate }) => {
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const settings = getSettings();

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard setActivePage={setActivePage} currentUser={user} />;
            case 'order-list':
                return <OrderList isAdmin={false} currentUser={user} />;
            case 'create-order':
                return <CreateOrder setActivePage={setActivePage} currentUser={user} />;
            case 'recharge':
                return <RechargeComponent setActivePage={setActivePage} currentUser={user} onUserUpdate={onUserUpdate} />;
            case 'admin-preview':
                return <AdminPreview />;
            case 'service-1':
            case 'service-2':
            case 'service-3':
            case 'service-4':
            case 'service-5':
                setActivePage('create-order');
                return <CreateOrder setActivePage={setActivePage} currentUser={user} />;
            default:
                return <Dashboard setActivePage={setActivePage} currentUser={user}/>;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                userRole="user"
                settings={settings}
                onLogout={onLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default UserPanel;