import axios from 'axios';
import {createDebugger} from "../components/debugger/createDebugger.jsx";

//Debugger: alleen errors en success als toast, zonder console
const debug = createDebugger({
    enableConsole: true,
    enableToast: false,
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
 * Haalt alle gebruikers op via de backend API.
 * @returns {Promise<Array>} Een array van gebruikers of lege array bij fout
 */
export async function getUsers() {
    try {
        debug.notify("debug", "Gebruikers ophalen vanaf API...");

        const res = await axios.get(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/users',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'novi-education-project-id': PROJECT_ID,
                },
            }
        );

        debug.notify("success", "Gebruikers ontvangen", { detail: res.data });
        return res.data;

    } catch (err) {
        debug.notify("error", "Fout bij ophalen gebruikers", { detail: err });
        return [];
    }
}
