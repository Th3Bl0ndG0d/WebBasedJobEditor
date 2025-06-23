import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';
import JobOverview from "../../pages/jobOverview/JobOverview.jsx";
import Profile from "../../pages/profile/Profile.jsx";

function Navigation() {
    return (
        <nav className="navbar">
            <div>
                {/*<img src="logo.png" alt="Logo" height="30"/>*/}
                <p>Web based job editor</p>
            </div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/JobOverview">Jobs</Link></li>
                <li><Link to="/profile/register">Settings</Link></li> {/* Link naar profiel bewerken */}
                <li>
                    <button type="button">Logout</button>
                </li>
            </ul>
        </nav>
    );
}


export default Navigation;