import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getLoggedInUser, setLoggedInUser, clearLoggedInUser, loginUser, registerUser } from './data/storage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
    const [loggedInUser, setLoggedInUserInternal] = useState<User | null>(null);
    const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = getLoggedInUser();
        setLoggedInUserInternal(user);
        setIsLoading(false);
    }, []);

    const handleSetLoggedInUser = (user: User) => {
        setLoggedInUserInternal(user);
        setLoggedInUser(user);
    };

    const handleLogin = async (email: string, pass: string): Promise<boolean> => {
        const user = loginUser(email, pass);
        if (user) {
            handleSetLoggedInUser(user);
            return true;
        }
        return false;
    };

    const handleRegister = async (name: string, email: string, phone: string, pass: string): Promise<boolean> => {
        const newUser = registerUser(name, email, phone, pass);
        if (newUser) {
            handleSetLoggedInUser(newUser);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        clearLoggedInUser();
        setLoggedInUserInternal(null);
        setAuthPage('login'); // Go back to login page
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center font-sans">লোড হচ্ছে...</div>;
    }

    if (!loggedInUser) {
        if (authPage === 'register') {
            return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setAuthPage('login')} />;
        }
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setAuthPage('register')} />;
    }

    if (loggedInUser.role === 'admin') {
        return <AdminPanel user={loggedInUser} onLogout={handleLogout} />;
    }
    
    return <UserPanel user={loggedInUser} onLogout={handleLogout} onUserUpdate={handleSetLoggedInUser} />;
};

export default App;
