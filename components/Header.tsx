import React from 'react';
import { Page, Settings } from '../types';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    userRole: 'admin' | 'user';
    settings: Settings;
    onLogout: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isSubItem?: boolean;
}> = ({ icon, label, isActive, onClick, isSubItem = false }) => (
    <li
        onClick={onClick}
        className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
            isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        } ${isSubItem ? 'pl-10' : ''}`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </li>
);


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, userRole, settings, onLogout }) => {
    const isOrderSubMenuActive = ['create-order', 'order-list'].includes(activePage);

    const userMenuItems = [
        { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <DashboardIcon /> },
        { id: 'order-parent', label: 'অর্ডার করুন', icon: <OrderIcon /> },
        { id: 'service-1', label: 'সার্ভার কপি টু এনআইডি', icon: <ServiceIcon /> },
        { id: 'service-2', label: 'ভোটার তথ্য চেক', icon: <ServiceIcon /> },
        { id: 'service-3', label: 'সার্ভার কপি আপডেটেড', icon: <ServiceIcon /> },
        { id: 'service-4', label: 'সার্ভার টু মাস্টার কপি', icon: <ServiceIcon /> },
        { id: 'service-5', label: 'টিন সার্টিফিকেট', icon: <ServiceIcon /> },
        { id: 'my-list', label: 'আমার ফাইনাল লিস্ট', icon: <ListIcon /> },
    ];
    
    const userSecondaryMenuItems = [
        { id: 'profile', label: 'আমার প্রোফাইল', icon: <UserIcon /> },
        { id: 'recharge', label: 'রিচার্জ', icon: <RechargeIcon /> },
        { id: 'admin-preview', label: 'অ্যাডমিন প্রিভিউ', icon: <ShieldIcon /> },
    ];

    const adminMenuItems = [
        { id: 'admin-dashboard', label: 'অ্যাডমিন ড্যাশবোর্ড', icon: <DashboardIcon /> },
        { id: 'order-list', label: 'অর্ডার ম্যানেজমেন্ট', icon: <OrderIcon /> },
        { id: 'manage-services', label: 'সার্ভিস ম্যানেজমেন্ট', icon: <ServiceIcon /> },
        { id: 'user-management', label: 'ইউজার ম্যানেজমেন্ট', icon: <UserGroupIcon /> },
        { id: 'settings', label: 'সেটিংস', icon: <SettingsIcon /> },
    ];


    const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;
    const secondaryMenuItems = userRole === 'admin' ? [] : userSecondaryMenuItems;


    return (
        <aside className="w-72 bg-gray-800 text-white flex-col p-4 hidden md:flex">
            <div className="text-center py-4 mb-4">
                 {settings.logo ? (
                     <img src={settings.logo} alt="Site Logo" className="mx-auto h-12" />
                 ) : (
                    <h1 className="text-2xl font-bold">{userRole === 'admin' ? 'অ্যাডমিন প্যানেল' : settings.siteName}</h1>
                 )}
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    {menuItems.map(item => {
                        if (item.id === 'order-parent' && userRole === 'user') {
                            return (
                                <React.Fragment key={item.id}>
                                    <NavItem 
                                        icon={item.icon}
                                        label={item.label}
                                        isActive={isOrderSubMenuActive}
                                        onClick={() => setActivePage('create-order')}
                                     />
                                     {isOrderSubMenuActive && (
                                         <ul>
                                             <NavItem 
                                                icon={<></>}
                                                label="অর্ডার তালিকা"
                                                isActive={activePage === 'order-list'}
                                                onClick={() => setActivePage('order-list')}
                                                isSubItem={true}
                                             />
                                             <NavItem 
                                                icon={<></>}
                                                label="নতুন অর্ডার"
                                                isActive={activePage === 'create-order'}
                                                onClick={() => setActivePage('create-order')}
                                                isSubItem={true}
                                             />
                                         </ul>
                                     )}
                                </React.Fragment>
                            )
                        }
                        return (
                             <NavItem 
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                isActive={activePage === item.id}
                                onClick={() => setActivePage(item.id as Page)}
                             />
                        )
                    })}
                </ul>
            </nav>
            <div className="mt-auto">
                 <ul>
                     {secondaryMenuItems.map(item => (
                         <NavItem 
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activePage === item.id}
                            onClick={() => setActivePage(item.id as Page)}
                         />
                    ))}
                 </ul>
                 <div className="border-t border-gray-700 mt-4 pt-4">
                     <button 
                        onClick={onLogout}
                        className="w-full flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 text-gray-400 hover:bg-red-500 hover:text-white"
                    >
                        <LogoutIcon />
                        <span className="ml-3 font-semibold">প্রস্থান</span>
                    </button>
                 </div>
            </div>
        </aside>
    );
};

// SVG Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ServiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RechargeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-4.944c3.218 0 6.22-1.12 8.618-3.04A12.02 12.02 0 0021 7.056a11.955 11.955 0 01-5.382-3.04z" /></svg>;

export default Sidebar;