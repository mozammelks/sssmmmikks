import React from 'react';
import { Page, Service, User } from '../types';
import { getOrders, getServices } from '../data/storage';

interface DashboardProps {
    setActivePage: (page: Page) => void;
    currentUser: User;
}

const InfoCard: React.FC<{ title: string; value: string; detail: string; color: string }> = ({ title, value, detail, color }) => (
    <div className={`p-6 rounded-lg shadow-md text-white ${color}`}>
        <h3 className="text-lg">{title}</h3>
        <p className="text-3xl font-bold my-2">{value}</p>
        <p className="text-sm opacity-80">{detail}</p>
    </div>
);

const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div className="flex items-center">
            <div className="mr-4 text-gray-500">{service.icon}</div>
            <p className="font-medium text-gray-700">{service.name}</p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${service.status === 'চালু' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {service.status}
        </span>
    </div>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const UserHeader: React.FC<{currentUser: User}> = ({ currentUser }) => {
    const userBalance = currentUser.balance;

    return (
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
        </div>
        <div className="flex items-center space-x-4 lg:space-x-6 mt-4 md:mt-0">
             <div className="flex items-center space-x-3 border border-gray-200 bg-gray-50 px-4 py-2 rounded-lg shadow-sm">
                <WalletIcon />
                <div>
                    <p className="text-xs text-gray-500">বর্তমান ব্যালেন্স</p>
                    <p className="font-semibold text-gray-800 text-md">৳{userBalance.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
             <div className="text-right hidden lg:block">
                <p className="font-semibold text-gray-700">তারিখ: {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-500">সময়: {new Date().toLocaleTimeString('bn-BD')}</p>
            </div>
            <div className="flex items-center space-x-2">
                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">{currentUser.name.substring(0, 2).toUpperCase()}</div>
                 <div>
                    <p className="font-semibold text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                 </div>
            </div>
        </div>
    </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ setActivePage, currentUser }) => {
    const allOrders = getOrders();
    const services = getServices();
    
    const userOrders = allOrders.filter(o => o.userId === currentUser.id);
    const lastOrder = userOrders.length > 0 ? userOrders[0] : null;
    const successfulUserOrders = userOrders.filter(o => o.status === 'সফল');
    const lastSuccessfulOrder = successfulUserOrders.length > 0 ? successfulUserOrders[0] : null;
    const uniqueServicesUsed = new Set(successfulUserOrders.map(o => o.service)).size;

    const infoCardsData = [
        { title: "মোট অর্ডার", value: `${userOrders.length} টি`, detail: "আপনার সকল অর্ডার", color: "bg-blue-500" },
        { title: "সর্বশেষ অর্ডার", value: lastOrder ? new Date(lastOrder.date).toLocaleDateString('bn-BD') : "N/A", detail: "সর্বশেষ অর্ডারের তারিখ", color: "bg-purple-500" },
        { title: "ব্যবহৃত মোট সার্ভিস", value: `${uniqueServicesUsed} টি`, detail: "সফল অর্ডারের ভিত্তিতে", color: "bg-green-500" },
        { title: "সর্বশেষ সফল সার্ভিস", value: lastSuccessfulOrder ? new Date(lastSuccessfulOrder.date).toLocaleString('bn-BD') : "N/A", detail: "সর্বশেষ সফল সেবার সময়", color: "bg-orange-500" },
    ];
    
    return (
        <div>
            <UserHeader currentUser={currentUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {infoCardsData.map(card => <InfoCard key={card.title} {...card} />)}
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">সার্ভিসের তালিকা ({services.length} টি সার্ভিস)</h2>
                <p className="text-gray-500 mb-6">সার্ভিসের বর্তমান অবস্থা</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => <ServiceItem key={service.id} service={service} />)}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
