import axios from 'axios';
import { parseApiError } from "./parseAPIError.js";
import {createDebugger} from "../components/debugger/createDebugger.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

//Debugger: alleen errors en success als toast, zonder console
const debug = createDebugger({
    enableConsole: true,
    enableToast: true,
    toastTypes: {
        success: true,
        error: true,
        info: true,
        warning: true,
        debug: false,
    }
});

/**
 * Probeert een gebruiker in te loggen met e-mailadres en wachtwoord.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<boolean>} True indien succesvol ingelogd
 */
export async function login(email, password) {
    try {
        debug.notify('debug', 'Login gestart');

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
        const userWithToken = { ...user, token };

        localStorage.setItem('authUser', JSON.stringify(userWithToken));

        debug.notify('success', 'Login succesvol');
        return true;
    } catch (error) {
        const errorMsg = parseApiError(error);
        debug.notify('debug', `Login mislukt: ${errorMsg}`);
        return false;
    }
}

/**
 * Verwijdert de ingelogde gebruiker uit localStorage.
 */
export function logout() {
    localStorage.removeItem('authUser');
    debug.notify('success', 'Uitgelogd');
}

/**
 * Haalt de huidige gebruiker op uit localStorage.
 * @returns {object|null} Gebruiker met token, of null indien niet gevonden
 */
export function getCurrentUser() {
    const user = localStorage.getItem('authUser');
    if (user) {
        const parsed = JSON.parse(user);
        debug.notify('debug', 'Gebruiker geladen uit localStorage');
        return parsed;
    }
    debug.notify('debug', 'Geen gebruiker in localStorage');
    return null;
}
