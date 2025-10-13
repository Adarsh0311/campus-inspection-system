import React, { createContext, useState, useContext, ReactNode } from 'react';
import authService from '../services/authService';

// Define the shape of the user object we'll store
interface User {
    email: string;
    token: string;
}

// Define the shape of the value our context will provide
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 1. Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Create the Provider component that will wrap our app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Login function that calls the service and updates the state
    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);
        if (response.data.token) {
            const userData: User = { email, token: response.data.token };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook to make it easy to use the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};