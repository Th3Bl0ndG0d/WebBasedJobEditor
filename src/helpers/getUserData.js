import axios from 'axios';
import { parseApiError } from "./parseAPIError.js";
import { createDebugger } from "../components/debugger/createDebugger.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

// Debuggerconfiguratie zoals in login.js
const debug = createDebugger({
    enableConsole: true,
    enableToast: true,
    toastTypes: {
        success: false,
        error: true,
        info: false,
        warning: false,
        debug: false,
    }
});

/**
 * Haalt gebruikersgegevens op aan de hand van het userId en JWT-token.
 * Wordt gebruikt bij sessieherstel en na login.
 * @param {string} userId - ID van de gebruiker zoals in de token.
 * @param {string} token - JWT-token voor authenticatie.
 * @returns {Promise<object>} Gebruikersdata van de backend
 */
export default async function getUserData(userId, token) {
    try {
        const response = await axios.get(
            `${API_URL}/users/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'novi-education-project-id': PROJECT_ID,
                }
            }
        );

        return response.data;
    } catch (error) {
        const msg = parseApiError(error);
        debug.notify('error', `Fout bij ophalen gebruikersgegevens: ${msg}`);
        throw error;
    }
}
