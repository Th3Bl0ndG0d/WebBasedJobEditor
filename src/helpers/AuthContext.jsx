// import React, { createContext, useContext, useState } from 'react';
//
// const AuthContext = createContext();
//
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null); // null = niet ingelogd
//
//     const login = (role) => setUser({ role });
//     const logout = () => setUser(null);
//
//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => useContext(AuthContext);
// helpers/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
//
// const AuthContext = createContext();
//
// export function AuthProvider({ children }) {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const [user, setUser] = useState(null); // Volledig gebruikersobject
//
//     // Controleer of er een sessie in localStorage staat
//     useEffect(() => {
//         const storedAuth = JSON.parse(localStorage.getItem("auth"));
//         if (storedAuth?.isAuthenticated && storedAuth.role && storedAuth.username) {
//             setIsAuthenticated(true);
//             setUserRole(storedAuth.role);
//             setUser({ role: storedAuth.role, username: storedAuth.username });
//             console.log("[AuthContext] Sessie hersteld uit localStorage:", storedAuth);
//         }
//     }, []);
//
//     // Login-functie met volledige gebruikersinfo
//     const login = (userData) => {
//         setIsAuthenticated(true);
//         setUser(userData);
//         setUserRole(userData.role);
//         localStorage.setItem("auth", JSON.stringify({
//             isAuthenticated: true,
//             role: userData.role,
//             username: userData.username
//         }));
//         console.log("[AuthContext] Ingelogd als:", userData);
//     };
//
//     // Verlaat sessie
//     const logout = () => {
//         console.log("[AuthContext] Gebruiker uitgelogd:", user);
//         setIsAuthenticated(false);
//         setUserRole(null);
//         setUser(null);
//         localStorage.removeItem("auth");
//     };
//
//     return (
//         <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
//
// export function useAuth() {
//     return useContext(AuthContext);
// }
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('🔐 Gebruiker ingelogd:', userData);
    };

    const logout = () => {
        console.log('🚪 Uitloggen gebruiker:', user?.username);
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
