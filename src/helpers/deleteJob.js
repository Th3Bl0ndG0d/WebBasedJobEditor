// src/helpers/deleteJob.js
import axios from 'axios';
import { getHeaders } from './getHeaders.js';
import { getJobById } from './getJobByID.js';
import { parseApiError } from './parseApiError.js';
import {createDebugger} from "../components/debugger/createDebugger.jsx";

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
 * Verwijdert een enkele plaat.
 */
async function deletePlate(plateId, token) {
    try {
        await axios.delete(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/plates/${plateId}`,
            { headers: getHeaders(token) }
        );
        debug.notify("success", `Plaat ${plateId} verwijderd.`);
    } catch (error) {
        debug.notify("error", parseApiError(error), { detail: error });
        throw error;
    }
}

/**
 * Verwijdert een enkele cylinder.
 */
async function deleteCylinder(cylinderId, token) {
    try {
        await axios.delete(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/cylinders/${cylinderId}`,
            { headers: getHeaders(token) }
        );
        debug.notify("success", `Cylinder ${cylinderId} verwijderd.`);
    } catch (error) {
        debug.notify("error", parseApiError(error), { detail: error });
        throw error;
    }
}

/**
 * Verwijdert de job zelf.
 */
async function deleteJobRecord(jobId, token) {
    try {
        await axios.delete(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs/${jobId}`,
            { headers: getHeaders(token) }
        );
        debug.notify("success", `Job ${jobId} verwijderd.`);
    } catch (error) {
        debug.notify("error", parseApiError(error), { detail: error });
        throw error;
    }
}

/**
 * Verwijdert een volledige job inclusief alle onderliggende cylinders en plates.
 * Haalt de volledige structuur op via getJobById().
 * @param {string} jobId - ID van de te verwijderen job
 * @param token
 * @returns {Promise<boolean>} True indien succesvol verwijderd, anders false
 */
export async function deleteJob(jobId,token) {
    try {
        debug.notify("debug", `Verzoek tot verwijderen van job: ${jobId}`);
        const job = await getJobById(jobId,token);
        if (!job) {
            debug.notify("error", "Job kon niet worden opgehaald.");
            return false;
        }

        for (const cylinder of job.cylinders) {
            for (const plate of cylinder.plates) {
                await deletePlate(plate.id, token);
            }
            await deleteCylinder(cylinder.id, token);
        }

        await deleteJobRecord(jobId, token);

        debug.notify("success", "Verwijderen van job succesvol afgerond.");
        return true;

    } catch (err) {
        debug.notify("error", "Verwijderen van job mislukt.", { detail: err });
        return false;
    }
}
