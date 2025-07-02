import React, { createContext, useContext, useState } from 'react';
import { login as loginUser, logout as logoutUser, getCurrentUser } from '../helpers/login.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
    const current = getCurrentUser();
    console.log("🧠 AuthProvider init met user:", current);
    return current;
});


    const login = async (email, password) => {
        const success = await loginUser(email, password);
        if (success) {
            const newUser = getCurrentUser();
            setUser(newUser);
            console.log('🔐 Ingelogd via API:', newUser);
        } else {
            console.error('❌ Inloggen via API mislukt');
        }
        return success;
    };

    const logout = () => {
        console.log('🚪 Uitloggen gebruiker:', user?.email);
        logoutUser();
        setUser(null);
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
AuthProvider.jsx

