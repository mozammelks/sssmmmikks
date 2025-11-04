import React, { useState } from 'react';
import { User } from '../types';
import { getUsers, saveUsers } from '../data/storage';

interface BalanceModalProps {
    user: User;
    onClose: () => void;
    onSave: (userId: string, amount: number) => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ user, onClose, onSave }) => {
    const [amount, setAmount] = useState<number>(0);

    const handleSave = () => {
        if (amount > 0) {
            onSave(user.id, amount);
        }
        onClose();
    };

    return React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" },
        React.createElement("div", { className: "bg-white rounded-lg p-8 w-full max-w-md" },
            React.createElement("h2", { className: "text-xl font-bold mb-4" }, `'${user.name}' এর ব্যালেন্স যোগ করুন`),
            React.createElement("p", { className: "mb-2 text-gray-600" }, `বর্তমান ব্যালেন্স: ৳${user.balance.toFixed(2)}`),
            React.createElement("div", { className: "mb-6" },
                React.createElement("label", { className: "block text-gray-700 font-medium mb-2" }, "টাকার পরিমাণ"),
                React.createElement("input", {
                    type: "number",
                    value: amount,
                    onChange: (e) => setAmount(parseFloat(e.target.value) || 0),
                    className: "w-full px-4 py-2 border rounded-md",
                    placeholder: "0.00",
                    min: "0"
                })
            ),
            React.createElement("div", { className: "flex justify-end space-x-4" },
                React.createElement("button", { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 rounded-md" }, "বাতিল"),
                React.createElement("button", { type: "button", onClick: handleSave, className: "px-4 py-2 bg-gray-800 text-white rounded-md" }, "সংরক্ষণ করুন")
            )
        )
    );
};


const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(getUsers());
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAddBalance = (userId: string, amount: number) => {
        const updatedUsers = users.map(u => 
            u.id === userId ? { ...u, balance: u.balance + amount } : u
        );
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };
    
    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-gray-800" }, "ইউজার ম্যানেজমেন্ট"),
                 React.createElement("p", { className: "text-gray-500" }, `মোট ${users.length} জন ব্যবহারকারী`)
            ),
            React.createElement("div", { className: "bg-white rounded-lg shadow-md p-4" },
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full text-left" },
                        React.createElement("thead", { className: "bg-gray-50" },
                            React.createElement("tr", null,
                                React.createElement("th", { className: "px-4 py-3 text-sm font-medium text-gray-600" }, "নাম"),
                                React.createElement("th", { className: "px-4 py-3 text-sm font-medium text-gray-600" }, "ইমেইল"),
                                React.createElement("th", { className: "px-4 py-3 text-sm font-medium text-gray-600" }, "মোবাইল নম্বর"),
                                React.createElement("th", { className: "px-4 py-3 text-sm font-medium text-gray-600" }, "ব্যালেন্স (টাকা)"),
                                React.createElement("th", { className: "px-4 py-3 text-sm font-medium text-gray-600" }, "কার্যক্রম")
                            )
                        ),
                        React.createElement("tbody", null,
                            users.map(user => (
                                React.createElement("tr", { key: user.id, className: "border-b" },
                                    React.createElement("td", { className: "px-4 py-3 font-medium" }, user.name),
                                    React.createElement("td", { className: "px-4 py-3 text-gray-600" }, user.email),
                                    React.createElement("td", { className: "px-4 py-3 text-gray-600" }, user.phone || 'N/A'),
                                    React.createElement("td", { className: "px-4 py-3 font-semibold" }, `৳${user.balance.toFixed(2)}`),
                                    React.createElement("td", { className: "px-4 py-3" },
                                        React.createElement("button", { onClick: () => setSelectedUser(user), className: "text-indigo-600 hover:text-indigo-900 font-medium" }, "ব্যালেন্স যোগ করুন")
                                    )
                                )
                            ))
                        )
                    )
                )
            ),
            selectedUser && React.createElement(BalanceModal, {
                user: selectedUser,
                onClose: () => setSelectedUser(null),
                onSave: handleAddBalance
            })
        )
    );
};

export default UserManagement;