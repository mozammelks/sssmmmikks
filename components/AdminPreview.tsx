import React from 'react';
import { getOrders, getServices, getUsers } from '../data/storage';
import { Order } from '../types';

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

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const statusClasses = {
        'সফল': "bg-green-100 text-green-800",
        'বিফল': "bg-red-100 text-red-800",
        'পেন্ডিং': "bg-yellow-100 text-yellow-800",
    };
    return React.createElement("span", { className: `${baseClasses} ${statusClasses[status]}` }, status);
};

const AdminPreview: React.FC = () => {
    const allOrders = getOrders();
    const allServices = getServices();
    const allUsers = getUsers();

    const totalUsers = allUsers.length;
    const totalRevenue = allOrders.filter(o => o.status === 'সফল').reduce((sum, order) => sum + order.price, 0);
    const pendingOrders = allOrders.filter(o => o.status === 'পেন্ডিং').length;
    const recentPendingOrders = allOrders.filter(o => o.status === 'পেন্ডিং').slice(0, 5);
    const totalServices = allServices.length;

    return (
        <div>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
                <p className="font-bold">অ্যাডমিন প্যানেল প্রিভিউ</p>
                <p>এটি অ্যাডমিন প্যানেলের একটি প্রিভিউ। এখানে আপনি শুধুমাত্র তথ্য দেখতে পারবেন, কোনো পরিবর্তন করতে পারবেন না।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoCard title="মোট ব্যবহারকারী" value={`${totalUsers}`} detail="নিবন্ধিত ব্যবহারকারী" color="bg-blue-500" icon={<UserGroupIcon />} />
                <InfoCard title="মোট আয়" value={`৳${totalRevenue.toLocaleString('bn-BD')}`} detail="সফল অর্ডার থেকে" color="bg-green-500" icon={<CurrencyBangladeshiIcon />} />
                <InfoCard title="পেন্ডিং অর্ডার" value={`${pendingOrders} টি`} detail="পর্যালোচনা প্রয়োজন" color="bg-yellow-500" icon={<ClockIcon />} />
                <InfoCard title="মোট সার্ভিস" value={`${totalServices} টি`} detail="সক্রিয় পরিষেবা" color="bg-purple-500" icon={<BriefcaseIcon />} />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">সাম্প্রতিক পেন্ডিং অর্ডারসমূহ</h2>
                 <p className="text-gray-500 mb-6">সর্বশেষ ৫টি পেন্ডিং অর্ডারের তালিকা নিচে দেওয়া হলো।</p>
                <div className="overflow-x-auto">
                    {recentPendingOrders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">সার্ভিস</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">ব্যবহারকারী</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">স্ট্যাটাস</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">তারিখ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPendingOrders.map(order => (
                                    <tr key={order.id} className="border-b">
                                        <td className="px-4 py-3 whitespace-nowrap">{order.service}</td>
                                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{order.userName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(order.date).toLocaleString('bn-BD')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-4">কোনো পেন্ডিং অর্ডার নেই।</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Icons (copied from AdminDashboard for consistency)
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CurrencyBangladeshiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3h2v8m0 4v2a2 2 0 11-2 2h-2a2 2 0 110-4h2a2 2 0 100-4H9" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default AdminPreview;
