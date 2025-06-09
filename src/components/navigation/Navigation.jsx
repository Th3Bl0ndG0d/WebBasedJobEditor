import React from 'react';
import './Navigation.css';

function Navigation() {
    return (
        <nav className="navbar">
            <div>
                {/*<img src="logo.png" alt="Logo" height="30"/>*/}
                <p>Web based job editor</p>
            </div>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/jobs">Jobs</a></li>
                <li><a href="/settings">Settings</a></li>
                <li>
                    <button type="button">Logout</button>
                </li>
            </ul>
        </nav>

    );
}

export default Navigation;