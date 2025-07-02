import React from 'react';
import './Navigation.css';

import { NavLink, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import Button from "../button/Button.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";

function Navigation() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div>
                <p>Web based job editor</p>
            </div>

            <ul className="nav-links">
                <li><NavLink to="/JobOverview" end className={({ isActive }) => isActive ? "active-tab" : ""}>JobOverview</NavLink></li>
                <li><NavLink to="/JobCreator" className={({ isActive }) => isActive ? "active-tab" : ""}>New job</NavLink></li>
                <li><NavLink to="/profile/edit" className={({ isActive }) => isActive ? "active-tab" : ""}>Settings</NavLink></li>

                {/* Alleen tonen als user bestaat */}
                {user?.email && (
                    <li className="nav-user">
                        <FiUser size={16} />
                        <span>{user.email}</span>
                    </li>
                )}

                <li>
                    <Button type="button" onClick={handleLogout} label="Logout" variant={"nav"} />
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
