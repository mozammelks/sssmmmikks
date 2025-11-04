import React, { useState } from 'react';
import { Page, User, Transaction } from '../types';
import { getUsers, saveUsers, getTransactions, saveTransactions } from '../data/storage';
import { sendRechargeNotification } from '../services/notificationService';


interface RechargeProps {
    setActivePage: (page: Page) => void;
    currentUser: User;
    onUserUpdate: (updatedUser: User) => void;
}

const bKashLogoUrl = 'https://i.ibb.co/28S4S16/bkash-logo-8120-A6-C23-E-seeklogo-com.png';


interface BkashModalProps {
    amount: number;
    currentUser: User;
    onClose: () => void;
    onSuccess: (updatedUser: User) => void;
}

const BkashModal: React.FC<BkashModalProps> = ({ amount, currentUser, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1 for number, 2 for PIN
    const [isLoading, setIsLoading] = useState(false);
    
    const handleConfirm = () => {
        if (!currentUser) return;

        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            const users = getUsers();
            const updatedUsers = users.map(u => 
                u.id === currentUser.id ? { ...u, balance: u.balance + amount } : u
            );
            saveUsers(updatedUsers);
            
            const updatedUser = updatedUsers.find(u => u.id === currentUser.id)!;

            // Create and save transaction record
            const newTransaction: Transaction = {
                id: `txn_${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                amount,
                type: 'recharge',
                method: 'bKash',
                status: 'সফল',
                date: new Date().toISOString()
            };
            const allTransactions = getTransactions();
            saveTransactions([newTransaction, ...allTransactions]);
            
            // Send notification
            sendRechargeNotification(updatedUser, amount)
                .catch(err => console.error("Failed to send recharge notification:", err));

            setIsLoading(false);
            onSuccess(updatedUser);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
                <img src={bKashLogoUrl} alt="bKash Logo" className="h-12 mx-auto mb-4"/>
                <p className="text-gray-600 mb-2">Merchant: সার্ভিস পয়েন্ট</p>
                <p className="text-2xl font-bold mb-6">৳ {amount.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</p>

                {step === 1 && (
                    <div>
                        <label htmlFor="bkash-number" className="block text-left text-sm font-medium text-gray-700 mb-2">আপনার বিকাশ একাউন্ট নাম্বার</label>
                        <input id="bkash-number" type="text" placeholder="e.g 01xxxxxxxxx" className="w-full px-4 py-2 border rounded-md mb-4"/>
                        <button onClick={() => setStep(2)} className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">পরবর্তী</button>
                    </div>
                )}

                {step === 2 && (
                     <div>
                        <label htmlFor="bkash-pin" className="block text-left text-sm font-medium text-gray-700 mb-2">আপনার পিন নাম্বার দিন</label>
                        <input id="bkash-pin" type="password" placeholder="PIN" className="w-full px-4 py-2 border rounded-md mb-4"/>
                        <button onClick={handleConfirm} disabled={isLoading} className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-400">
                            {isLoading ? 'প্রসেসিং...' : 'কনফার্ম'}
                        </button>
                    </div>
                )}
                
                <button onClick={onClose} disabled={isLoading} className="mt-4 text-pink-600 text-sm">বন্ধ করুন</button>
            </div>
        </div>
    );
};


const RechargeComponent: React.FC<RechargeProps> = ({ setActivePage, currentUser: initialUser, onUserUpdate }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<User>(initialUser);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!currentUser) {
        return <div>ব্যবহারকারী খুঁজে পাওয়া যায়নি।</div>;
    }

    const handleRecharge = () => {
        if (typeof amount !== 'number' || amount <= 0) {
            setError('অনুগ্রহ করে একটি সঠিক পরিমাণ লিখুন।');
            return;
        }
        setError('');
        setIsModalOpen(true);
    };
    
    const handleSuccess = (updatedUser: User) => {
        setIsModalOpen(false);
        setCurrentUser(updatedUser);
        onUserUpdate(updatedUser); // Notify parent of the update
        setAmount('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ব্যালেন্স রিচার্জ করুন</h1>
            <p className="text-gray-500 mb-6">bKash এর মাধ্যমে নিরাপদে আপনার অ্যাকাউন্টে ব্যালেন্স যোগ করুন।</p>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <p className="text-gray-500">আপনার বর্তমান ব্যালেন্স</p>
                    <p className="text-4xl font-bold text-gray-800">৳{currentUser.balance.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                {showSuccess && (
                     <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                        <p className="font-bold">সফল!</p>
                        <p>আপনার অ্যাকাউন্টে সফলভাবে ব্যালেন্স যোগ করা হয়েছে।</p>
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">টাকার পরিমাণ (BDT)</label>
                    <input 
                        type="number" 
                        id="amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        placeholder="কত টাকা যোগ করতে চান?"
                        className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button 
                    onClick={handleRecharge} 
                    className="w-full flex items-center justify-center py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                    <img src={bKashLogoUrl} alt="bKash" className="h-6 mr-3" />
                    <span className="font-semibold text-lg">bKash দিয়ে পেমেন্ট করুন</span>
                </button>
            </div>
            {isModalOpen && <BkashModal amount={Number(amount)} currentUser={currentUser} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />}
        </div>
    );
};

export default RechargeComponent;
