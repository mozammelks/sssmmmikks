import { Order, User } from '../types';
import { getSettings, getUsers } from '../data/storage';

const formatDateForTelegram = (date: Date): string => {
    const datePart = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    return `${datePart} ${timePart}`;
}

const sendTelegramMessage = async (message: string) => {
    const settings = getSettings();
    const { telegramBotToken, telegramChatId } = settings;

    if (!telegramBotToken || !telegramChatId) {
        console.warn("Telegram settings are not configured. Skipping notification.");
        return;
    }
    
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram API Error:", result.description);
            throw new Error(`Telegram API Error: ${result.description}`);
        }
    } catch (error) {
        console.error("Failed to send Telegram notification:", error);
        throw error;
    }
};

export const sendRechargeNotification = async (user: User, amount: number): Promise<void> => {
    const newBalance = user.balance; // The user object already has the updated balance
    const message = `*✅ ব্যালেন্স যোগ হয়েছে!*\n\n*ব্যবহারকারী:* ${user.name}\n*ইমেইল:* ${user.email}\n*ফোন:* ${user.phone || 'N/A'}\n*রিচার্জ পরিমাণ:* ${amount.toLocaleString('bn-BD')} টাকা\n*নতুন ব্যালেন্স:* ${newBalance.toLocaleString('bn-BD')} টাকা`;
    await sendTelegramMessage(message);
};


export const sendTelegramNotification = async (order: Order): Promise<void> => {
    const users = getUsers();
    const orderUser = users.find(u => u.name === order.userName);
    
    const balanceText = orderUser 
        ? `${orderUser.balance.toLocaleString('bn-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} টাকা।`
        : 'N/A';

    const message = `*নতুন ${order.service} অর্ডার এসেছে}}^{*}\n\n*নাম:* ${order.type}\n*আইডি নাম্বার:* \`${order.identifier}\`\n*নোট:* ${order.note || 'N/A'}\n*ইমেইল:* ${orderUser?.email || 'N/A'}\n*ফোন নম্বর:* ${orderUser?.phone || 'N/A'}\n*সময়:* ${formatDateForTelegram(new Date(order.date))}\n*অর্ডারকারী বর্তমান ব্যালেন্স:* ${balanceText}\n\nঅনুগ্রহ করে দ্রুত অর্ডারটি পর্যালোচনা করুন।`;

    await sendTelegramMessage(message);
};