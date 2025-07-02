// login.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

export async function login(email, password) {
    try {
        console.log('📡 login.js: login functie aangeroepen');
        console.log('➡️ Login request naar:', `${API_URL}/login`);

        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            {
                headers: {
                    'novi-education-project-id': PROJECT_ID,
                }
            }
        );

        const { token, user } = response.data;

        // Voeg token toe aan user-object
        const userWithToken = { ...user, token };

        localStorage.setItem('authUser', JSON.stringify(userWithToken));

        console.log('✅ Login succesvol. Gebruiker opgeslagen:', userWithToken);
        return true;
    } catch (error) {
        console.error('❌ Login mislukt:', error.response?.data || error.message);
        return false;
    }
}

export function logout() {
    console.log('🚪 Uitloggen - authUser verwijderen');
    localStorage.removeItem('authUser');
}

export function getCurrentUser() {
    const user = localStorage.getItem('authUser');
    if (user) {
        const parsed = JSON.parse(user);
        console.log('📦 Huidige gebruiker geladen uit localStorage:', parsed);
        return parsed;
    }
    console.log('⚠️ Geen gebruiker gevonden in localStorage');
    return null;
}
