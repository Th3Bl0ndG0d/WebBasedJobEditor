import axios from 'axios';
import { getHeaders } from './getHeaders.js';
import {createDebugger} from "../components/debugger/createDebugger.jsx";
import {parseApiError} from "./parseAPIError.js";


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
 * Haalt één volledige jobstructuur op, inclusief cylinders en plates.
 * @param {string} jobId - Het ID van de job die opgehaald moet worden
 * @returns {Promise<Object|null>} De job inclusief geneste structuur of null bij fout
 */
export async function getJobById(jobId,token) {
    try {
        debug.notify("debug", `Start ophalen van job met ID: ${jobId}`);

        // Stap 1: Haal job op
        const jobRes = await axios.get(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs/${jobId}`,
            {
                headers: getHeaders(token)
            }
        );

        const job = jobRes.data;
        debug.notify("success", "Job succesvol opgehaald", { detail: job });

        // Stap 2: Haal cylinders op
        const cylRes = await axios.get(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs/${job.id}/cylinders`,
            {
                headers: getHeaders(token)
            }
        );

        const cylinders = cylRes.data;
        debug.notify("debug", `${cylinders.length} cylinders opgehaald`, { detail: cylinders });

        // Stap 3: Haal voor elke cylinder de plates op
        for (const cylinder of cylinders) {
            debug.notify("debug", `Ophalen van plates voor cylinder ID: ${cylinder.id}`);

            const platesRes = await axios.get(
                `https://novi-backend-api-wgsgz.ondigitalocean.app/api/cylinders/${cylinder.id}/plates`,
                {
                    headers: getHeaders(token)
                }
            );

            const plates = platesRes.data;
            debug.notify("debug", `${plates.length} plates gevonden`, { detail: plates });

            cylinder.plates = plates;
        }

        // Voeg cylinders toe aan job
        job.cylinders = cylinders;

        debug.notify("debug", "Volledige jobstructuur succesvol geladen");
        return job;

    } catch (err) {
        debug.notify("error", parseApiError(err));
        return null;
    }
}
