// import React from 'react';
// import './Navigation.css';
// import { useAuth } from "../../helpers/AuthContext.jsx";
// import { Link, useNavigate } from 'react-router-dom';
//
// function Navigation() {
//     const { logout, user } = useAuth();
//     const navigate = useNavigate();
//
//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };
//
//     return (
//         <nav className="navbar">
//             <div>
//                 <p>Web based job editor</p>
//             </div>
//             <ul>
//                 <li><Link to="/">Home</Link></li>
//                 <li><Link to="/JobOverview">Jobs</Link></li>
//                 <li><Link to="/profile/edit">Settings</Link></li>
//                 <li>
//                     <button type="button" onClick={handleLogout}>Logout</button>
//                 </li>
//             </ul>
//         </nav>
//     );
// }
//
// export default Navigation;

import React from 'react';
import './Navigation.css';
import { useAuth } from "../../helpers/AuthContext.jsx";
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import Button from "../button/Button.jsx";

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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/JobOverview">Jobs</Link></li>
                <li><Link to="/profile/edit">Settings</Link></li>

                {/* ✅ Alleen tonen als user bestaat */}
                {user?.username && (
                    <li className="nav-user">
                        <FiUser size={16} />
                        <span>{user.username}</span>
                    </li>
                )}

                <li>
                    <Button type="button" onClick={handleLogout} label="Logout" />
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
