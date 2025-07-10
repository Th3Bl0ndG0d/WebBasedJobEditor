import axios from "axios";
import { parseApiError } from "./parseAPIError.js";
import {createDebugger} from "../components/debugger/createDebugger.jsx";

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
 * Haalt alle jobs op via de backend API.
 * @param {string} token - JWT token voor authenticatie
 * @returns {Promise<Array|null>} Array van jobs of null bij fout
 */
export async function getJobs(token) {
    debug.notify("debug", "getJobs() gestart");

    if (!token) {
        debug.notify("error", "Geen geldig token. Kan jobs niet ophalen.");
        return null;
    }

    try {
        debug.notify("debug", "Verstuur GET-request naar jobs-endpoint...");
        debug.notify("debug", "Headers:", {
            detail: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const response = await axios.get(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        debug.notify("debug", `Response ontvangen (status: ${response.status})`);
        debug.notify("debug", "Response data:", { detail: response.data });

        return response.data;
    } catch (error) {
        debug.notify("error", parseApiError(error));
        return null;
    }
}
