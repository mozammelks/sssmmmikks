import React, { useState } from 'react';
import Sidebar from './Header';
import OrderList from '../services/geminiService';
import AdminDashboard from './AdminDashboard';
import ManageServices from './ManageServices';
import UserManagement from './UserManagement';
import SettingsComponent from './Settings';
import { Page, Settings, User } from '../types';
import { getSettings, saveSettings } from '../data/storage';

interface AdminPanelProps {
    user: User;
    onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
    const [activePage, setActivePage] = useState<Page>('admin-dashboard');
    const [settings, setSettings] = useState<Settings>(getSettings());
    
    const handleSaveSettings = (newSettings: Settings) => {
        saveSettings(newSettings);
        setSettings(newSettings);
    };

    const renderPage = () => {
        switch (activePage) {
            case 'admin-dashboard':
                return <AdminDashboard setActivePage={setActivePage} />;
            case 'order-list':
                return <OrderList isAdmin={true} currentUser={user} />;
            case 'manage-services':
                return <ManageServices />;
            case 'user-management':
                return <UserManagement />;
            case 'settings':
                return <SettingsComponent currentSettings={settings} onSave={handleSaveSettings} />;
            default:
                return <AdminDashboard setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                userRole="admin"
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
}

export default AdminPanel;
