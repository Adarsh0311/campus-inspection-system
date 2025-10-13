import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.email}!</p>
            <button className="btn btn-secondary" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;