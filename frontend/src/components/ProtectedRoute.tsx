import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useAuth(); // Get the current user from our AuthContext

    if (!user) {
        // to redirect them to the login page.
        return <Navigate to="/login" />;
    }

    // If a user exists, we render the <Outlet /> component.
    // The <Outlet /> is a placeholder that will be replaced by the actual page component the user was trying to access (e.g., the Dashboard).
    return <Outlet />;
};

export default ProtectedRoute;