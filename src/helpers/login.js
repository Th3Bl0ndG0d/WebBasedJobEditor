// login.js
import axios from 'axios';

// Haal base URL uit je .env bestand (werkt met Vite)
const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

/**
 * Logt in bij de API met e-mail en wachtwoord.
 * Slaat token en user op in localStorage bij succes.
 */
export async function login(email, password) {
    try {
        console.log('📡 login.js: login functie aangeroepen');
        console.log('➡️ Login attempt:', { email, password }); // let op: wachtwoord niet loggen in productie
        console.log('➡️ Command that will be send:',`${API_URL}/login`); // let op: wachtwoord niet loggen in productie
        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            {
                headers: {
                    'novi-education-project-id': PROJECT_ID,
                }
            }
        );

        console.log('✅ API response ontvangen:', response.data);

        const { token, user } = response.data;

        console.log('🪪 JWT-token ontvangen:', token);
        console.log('👤 Ingelogde gebruiker:', user);

        // Token en user opslaan in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));

        console.log('💾 Token en user opgeslagen in localStorage');

        return true;
    } catch (error) {
        console.error('❌ Login mislukt:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Verwijdert token en user uit localStorage (uitloggen).
 */
export function logout() {
    console.log('🚪 Uitloggen - verwijderen authToken en authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
}

/**
 * Geeft de huidige ingelogde gebruiker terug (of null).
 */
export function getCurrentUser() {
    const user = localStorage.getItem('authUser');
    if (user) {
        console.log('📦 Gebruiker opgehaald uit localStorage:', JSON.parse(user));
        return JSON.parse(user);
    } else {
        console.log('⚠️ Geen ingelogde gebruiker gevonden in localStorage');
        return null;
    }
}
