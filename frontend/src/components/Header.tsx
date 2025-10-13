import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    Campus Inspection System
                </a>
                {/* We will add login/logout buttons here later */}
            </div>
        </nav>
    );
};

export default Header;