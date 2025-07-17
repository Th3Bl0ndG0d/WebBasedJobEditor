import axios from 'axios';
import {createDebugger} from "../components/debugger/createDebugger.jsx";
import {parseApiError} from "./parseAPIError.js";

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
        debug: true,
    }
});

/**
 * Probeert een gebruiker in te loggen met e-mailadres en wachtwoord.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<boolean>} True indien succesvol ingelogd
 */
export async function loginUser(email, password) {
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
        debug.notify('success', 'Login succesvol');
        return response.data;
    } catch (error) {
        const errorMsg = parseApiError(error);
        debug.notify('debug', `Login mislukt: ${errorMsg}`);
        throw error;
    }
}
export default loginUser;
