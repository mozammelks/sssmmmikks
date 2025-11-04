import React from 'react';
import { getOrders, getServices } from '../data/storage';
import { Page } from '../types';

const InfoCard: React.FC<{ title: string; value: string; detail: string; color: string; icon: React.ReactNode }> = ({ title, value, detail, color, icon }) => (
    <div className={`p-6 rounded-lg shadow-md text-white ${color} flex items-center`}>
        <div className="mr-4">{icon}</div>
        <div>
            <h3 className="text-lg">{title}</h3>
            <p className="text-3xl font-bold my-1">{value}</p>
            <p className="text-sm opacity-80">{detail}</p>
        </div>
    </div>
);

interface AdminDashboardProps {
    setActivePage: (page: Page) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActivePage }) => {
    const allOrders = getOrders();
    const allServices = getServices();

    const totalUsers = new Set(allOrders.map(o => o.userName)).size;
    const totalRevenue = allOrders.filter(o => o.status === 'সফল').reduce((sum, order) => sum + order.price, 0);
    const pendingOrders = allOrders.filter(o => o.status === 'পেন্ডিং').length;
    const totalServices = allServices.length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">অ্যাডমিন ড্যাশবোর্ড</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoCard title="মোট ব্যবহারকারী" value={`${totalUsers}`} detail="সক্রিয় ব্যবহারকারী" color="bg-blue-500" icon={<UserGroupIcon />} />
                <InfoCard title="মোট আয়" value={`৳${totalRevenue.toLocaleString('bn-BD')}`} detail="সফল অর্ডার থেকে" color="bg-green-500" icon={<CurrencyBangladeshiIcon />} />
                <InfoCard title="পেন্ডিং অর্ডার" value={`${pendingOrders} টি`} detail="অবিলম্বে ব্যবস্থা নিন" color="bg-yellow-500" icon={<ClockIcon />} />
                <InfoCard title="মোট সার্ভিস" value={`${totalServices} টি`} detail="সক্রিয় পরিষেবা" color="bg-purple-500" icon={<BriefcaseIcon />} />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">দ্রুত পদক্ষেপ</h2>
                 <p className="text-gray-500 mb-6">গুরুত্বপূর্ণ কাজগুলো এখান থেকে দ্রুত সম্পন্ন করুন।</p>
                 <div className="flex space-x-4">
                     <button onClick={() => setActivePage('order-list')} className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700">অর্ডার ম্যানেজ করুন</button>
                     <button onClick={() => setActivePage('manage-services')} className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700">সার্ভিস ম্যানেজ করুন</button>
                 </div>
            </div>
        </div>
    );
};

const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CurrencyBangladeshiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3h2v8m0 4v2a2 2 0 11-2 2h-2a2 2 0 110-4h2a2 2 0 100-4H9" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default AdminDashboard;