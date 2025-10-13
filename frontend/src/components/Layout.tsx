import React from 'react';
import Header from './Header';

// This is a simple functional component in React.
// It accepts 'children' as a prop. 'children' will be whatever
// components are nested inside the <Layout> component.
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <main className="container mt-4">
                {/* The content of each page will be rendered here */}
                {children}
            </main>
        </div>
    );
};

export default Layout;