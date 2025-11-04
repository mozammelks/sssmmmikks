import React, { useState } from 'react';
import { Order, User } from '../types';
import { getOrders, saveOrders } from '../data/storage';

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const statusClasses = {
        'সফল': "bg-green-100 text-green-800",
        'বিফল': "bg-red-100 text-red-800",
        'পেন্ডিং': "bg-yellow-100 text-yellow-800",
    };
    return React.createElement("span", { className: `${baseClasses} ${statusClasses[status]}` }, status);
};

const StatusSelector: React.FC<{ status: Order['status'], onChange: (newStatus: Order['status']) => void }> = ({ status, onChange }) => {
    return React.createElement("select", {
        value: status,
        // FIX: Explicitly type the event parameter 'e' to resolve overload error.
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as Order['status']),
        className: "px-2 py-1 border rounded-md focus:outline-none bg-gray-50"
    },
        React.createElement("option", { value: 'সফল' }, "সফল"),
        React.createElement("option", { value: 'পেন্ডিং' }, "পেন্ডিং"),
        React.createElement("option", { value: 'বিফল' }, "বিফল")
    );
};

interface FileUploadModalProps {
    order: Order;
    onClose: () => void;
    onUpload: (orderId: string, fileData: string) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ order, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('শুধুমাত্র PDF ফাইল আপলোড করা যাবে।');
                setFile(null);
            } else {
                setFile(selectedFile);
                setError('');
            }
        }
    };

    const handleSubmit = () => {
        if (!file) {
            setError('অনুগ্রহ করে একটি PDF ফাইল নির্বাচন করুন।');
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            onUpload(order.id, reader.result as string);
        };
        reader.onerror = () => {
            setError('ফাইল পড়তে সমস্যা হয়েছে।');
        };
    };

    return React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" },
        React.createElement("div", { className: "bg-white rounded-lg p-8 w-full max-w-md" },
            React.createElement("h2", { className: "text-xl font-bold mb-4" }, `অর্ডার #${order.id} এর জন্য ফাইল আপলোড করুন`),
            React.createElement("p", { className: "mb-6 text-gray-600" }, "অর্ডারটি সফল হিসেবে চিহ্নিত করতে একটি PDF ফাইল আপলোড করা আবশ্যক।"),
            React.createElement("div", null,
                React.createElement("input", { type: "file", accept: ".pdf", onChange: handleFileChange, className: "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" }),
                error && React.createElement("p", { className: "text-red-500 text-sm mt-2" }, error),
                file && React.createElement("p", { className: "text-green-600 text-sm mt-2" }, `নির্বাচিত ফাইল: ${file.name}`),
            ),
            React.createElement("div", { className: "flex justify-end space-x-4 mt-8" },
                React.createElement("button", { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 rounded-md" }, "বাতিল"),
                React.createElement("button", { type: "button", onClick: handleSubmit, disabled: !file, className: "px-4 py-2 bg-gray-800 text-white rounded-md disabled:bg-gray-400" }, "আপলোড ও সফল করুন")
            )
        )
    );
};


const OrderList: React.FC<{isAdmin?: boolean, currentUser: User}> = ({ isAdmin = false, currentUser }) => {
    const [allOrders, setAllOrders] = useState<Order[]>(getOrders());
    const [uploadModalOrder, setUploadModalOrder] = useState<Order | null>(null);

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        if (isAdmin && newStatus === 'সফল') {
            const orderToUpdate = allOrders.find(o => o.id === orderId);
            if (orderToUpdate) setUploadModalOrder(orderToUpdate);
        } else {
            const updatedOrders = allOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus, fileData: newStatus !== 'সফল' ? undefined : order.fileData } : order
            );
            setAllOrders(updatedOrders);
            saveOrders(updatedOrders);
        }
    };

    const handleFileUpload = (orderId: string, fileData: string) => {
        const updatedOrders = allOrders.map(order => 
            order.id === orderId ? { ...order, status: 'সফল' as const, fileData: fileData } : order
        );
        setAllOrders(updatedOrders);
        saveOrders(updatedOrders);
        setUploadModalOrder(null);
    };
    
    const handleDownload = (fileData: string, orderId: string) => {
        const byteCharacters = atob(fileData.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/pdf'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `order-${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const orders = isAdmin ? allOrders : allOrders.filter(o => o.userId === currentUser.id);

    const headers = isAdmin
        ? ['সেবা', 'ধরন', 'এসোসিয়েটেড নাম্বার/ডকুমেন্ট', 'ব্যবহারকারী', 'স্ট্যাটাস', 'তৈরির তারিখ', 'কার্যক্রম']
        : ['সেবা', 'ধরন', 'এসোসিয়েটেড নাম্বার/ডকুমেন্ট', 'স্ট্যাটাস', 'তৈরির তারিখ', 'কার্যক্রম'];

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-2xl font-bold text-gray-800" }, "অর্ডার তালিকা"),
                    React.createElement("p", { className: "text-gray-500" }, `মোট ${orders.length} টি অর্ডার পাওয়া গেছে`)
                ),
                 !isAdmin && React.createElement("button", { className: "bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700 transition duration-200" },
                    React.createElement("span", { className: "font-bold text-xl mr-2" }, "+"),
                    " নতুন অর্ডার"
                )
            ),

            React.createElement("div", { className: "bg-white rounded-lg shadow-md p-4" },
                React.createElement("div", { className: "flex justify-between items-center mb-4" },
                    React.createElement("input", {
                        type: "text",
                        placeholder: "যেকোনো ইনফরমেশন দিয়ে সার্চ করুন...",
                        className: "w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }),
                    React.createElement("div", { className: "flex space-x-4" },
                        React.createElement("select", { className: "px-4 py-2 border rounded-md focus:outline-none" },
                            React.createElement("option", null, "সকল")
                        ),
                        React.createElement("select", { className: "px-4 py-2 border rounded-md focus:outline-none" },
                            React.createElement("option", null, "সব সেবা")
                        )
                    )
                ),

                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full text-left" },
                        React.createElement("thead", { className: "bg-gray-50" },
                            React.createElement("tr", null,
                                headers.map(h => (
                                    React.createElement("th", { key: h, className: "px-4 py-3 text-sm font-medium text-gray-600 whitespace-nowrap" }, h)
                                ))
                            )
                        ),
                        React.createElement("tbody", null,
                            orders.map(order => (
                                React.createElement("tr", { key: order.id, className: "border-b" },
                                    React.createElement("td", { className: "px-4 py-3 whitespace-nowrap" }, order.service),
                                    React.createElement("td", { className: "px-4 py-3 whitespace-nowrap" }, order.type),
                                    React.createElement("td", { className: "px-4 py-3 whitespace-nowrap" }, order.identifier),
                                    isAdmin && React.createElement("td", { className: "px-4 py-3 whitespace-nowrap font-medium text-gray-700" }, order.userName),
                                    React.createElement("td", { className: "px-4 py-3 whitespace-nowrap" }, 
                                        isAdmin 
                                        ? React.createElement(StatusSelector, { status: order.status, onChange: (newStatus) => handleStatusChange(order.id, newStatus) })
                                        : React.createElement(StatusBadge, { status: order.status })
                                    ),
                                    React.createElement("td", { className: "px-4 py-3 whitespace-nowrap" }, new Date(order.date).toLocaleString('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })),
                                    React.createElement("td", { className: "px-4 py-3 whitespace-nowrap" },
                                         React.createElement("button", { 
                                            onClick: () => order.fileData && handleDownload(order.fileData, order.id),
                                            className: "bg-green-100 text-green-800 px-4 py-1 rounded-md hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
                                            disabled: order.status !== 'সফল' || !order.fileData
                                        }, "ডাউনলোড")
                                    )
                                )
                            ))
                        )
                    )
                ),

                React.createElement("div", { className: "flex justify-between items-center mt-4" },
                    React.createElement("p", { className: "text-gray-600 text-sm" }, `১-${orders.length} এর মধ্যে ${orders.length} টি`),
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("button", { className: "px-3 py-1 border rounded-md" }, "পূর্ববর্তী"),
                        React.createElement("span", { className: "px-3 py-1 bg-gray-800 text-white rounded-md mx-2" }, "1"),
                        React.createElement("button", { className: "px-3 py-1 border rounded-md" }, "পরবর্তী")
                    )
                )
            ),
            uploadModalOrder && React.createElement(FileUploadModal, {
                order: uploadModalOrder,
                onClose: () => setUploadModalOrder(null),
                onUpload: handleFileUpload
            })
        )
    );
};

export default OrderList;