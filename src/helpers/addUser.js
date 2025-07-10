import axios from 'axios';
import { parseApiError } from './parseApiError.js';
import {createDebugger} from "../components/debugger/createDebugger.jsx"; // Zorg dat het pad klopt

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

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

/**
 * 🔧 Maakt een gebruiker aan via de API
 * @param {Object} user - Object met gebruikersgegevens: email, password en (optioneel) role(s)
 * @returns {Promise<Object|null>} De aangemaakte gebruiker of null bij fout
 */
export async function addUser(user) {
    try {
        debug.notify("info", "Verstuur gebruiker naar API:", { detail: user });

        const payload = {
            email: user.email,
            password: user.password,
            roles: [user.roles || user.role].flat(),
        };

        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/users',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'novi-education-project-id': PROJECT_ID,
                }
            }
        );

        debug.notify("success", "Gebruiker aangemaakt:", { detail: res.data });
        return res.data;

    } catch (err) {
        const errorMsg = parseApiError(err);
        debug.notify("error","Fout bij aanmaken gebruiker:", errorMsg);
        return null;
    }
}
