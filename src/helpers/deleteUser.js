import axios from 'axios';
import { getHeaders } from './getHeaders.js';
import { createDebugger } from '../components/debugger/createDebugger.jsx';
import { parseApiError } from './parseApiError.js';

const debug = createDebugger({
    enableConsole: true,
    enableToast: true,
    toastTypes: {
        success: true,
        error: true,
        info: true,
        warning: true,
        debug: true,
    }
});

/**
 * Verwijdert een gebruiker via de backend API.
 * @param {string} id - Emailadres van de te verwijderen gebruiker
 * @param {string} token - JWT token voor authenticatie
 * @returns {Promise<boolean>} True indien succesvol verwijderd, anders false
 */
export async function deleteUser(id, token) {
    try {
        debug.notify("info", `Verzoek tot verwijderen van gebruiker: ${id}`);

        const response = await axios.delete(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/users/${id}`,
            { headers: getHeaders(token) }
        );

        debug.notify("success", `Gebruiker '${id}' succesvol verwijderd.`, {
            detail: response.data
        });

        return true;
    } catch (err) {
        const status = err.response?.status;

        if (status === 403) {
            debug.notify("error", "Error 403");
        }

        debug.notify("error", parseApiError(err));
        return false;
    }
}
