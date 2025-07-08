import axios from 'axios';
import { getCurrentUser } from './login.js';
import { getHeaders } from "./getHeaders.js";

import { parseApiError } from './parseApiError.js';
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
        debug: false,
    }
});


/**
 * Maakt een enkele plaat aan via de API
 * @param {Object} plate - De plaatgegevens (width, topHeight, bottomHeight, x, y, cylinderId)
 * @returns {Promise<string|null>} Het ID van de aangemaakte plaat of null bij fout
 */
export async function createPlate(plate) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        debug.notify("debug", "Geen geldige gebruiker.");
        return null;
    }

    try {
        const headers = getHeaders(currentUser.token);
        debug.notify("debug", "Endpoint: /api/plates");
        debug.notify("debug", "Headers:", { detail: headers });
        debug.notify("debug", "Payload:", { detail: plate });

        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/plates',
            plate,
            { headers }
        );

        const plateId = res.data.id;
        debug.notify("debug", `late aangemaakt (ID: ${plateId})`, { detail: res.data });
        return plateId;

    } catch (err) {
        debug.notify("debug", "Fout bij aanmaken plate:",parseApiError(err));
        return null;
    }
}

/**
 * Maakt een cylinder aan via de API met referentie naar een jobId
 * @param {Object} cylinder - Cylindergegevens (name, jobId)
 * @returns {Promise<string|null>} Het ID van de aangemaakte cylinder of null bij fout
 */
export async function createCylinder(cylinder) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        debug.notify("warning", "Geen geldige gebruiker.");
        return null;
    }

    try {
        const headers = getHeaders(currentUser.token);
        debug.notify("debug", "Endpoint: /api/cylinders");
        debug.notify("debug", "Headers:", { detail: headers });
        debug.notify("debug", "Payload:", { detail: cylinder });

        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/cylinders',
            cylinder,
            { headers }
        );

        const cylinderId = res.data.id;
        debug.notify("success", `Cylinder aangemaakt (ID: ${cylinderId})`, { detail: res.data });
        return cylinderId;

    } catch (err) {
        debug.notify("error", "Fout bij aanmaken cylinder:",parseApiError(err));
        return null;
    }
}

/**
 * Voert de volledige jobcreatie uit: eerst job, dan cylinders, dan plates
 * @param {Object} jobObject - Structuur met jobdetails + bijhorende cylinders en plates
 * @returns {Promise<Object|null>} De aangemaakte job of null bij fout
 */
export async function createFullJob(jobObject) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        debug.notify("error", "Niet ingelogd.");
        return null;
    }

    try {
        debug.notify("info", "Start volledige jobcreatie met input:", { detail: jobObject });

        // 1. Maak eerst de job aan (zonder cylinders of plates)
        const jobPayload = {
            number: jobObject.number,
            name: jobObject.name,
            info: jobObject.info,
            date: jobObject.date,
            repeat: jobObject.repeat
        };

        const headers = getHeaders(currentUser.token);
        debug.notify("info", "📤 Endpoint: /api/jobs");
        debug.notify("info", "📤 Headers:", { detail: headers });
        debug.notify("info", "📤 Payload:", { detail: jobPayload });

        const jobRes = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs',
            jobPayload,
            { headers }
        );

        const jobId = jobRes.data.id;
        debug.notify("success", `Job aangemaakt (ID: ${jobId})`);

        // 2. Cylinders aanmaken per stuk, met jobId
        for (const cyl of jobObject.cylinders) {
            const cylinderPayload = {
                name: cyl.name,
                jobId: jobId
            };

            const cylinderId = await createCylinder(cylinderPayload);
            if (!cylinderId) continue;

            // 3. Plates aanmaken per stuk, met cylinderId
            for (const plate of cyl.plates) {
                const platePayload = {
                    width: plate.width,
                    topHeight: plate.topHeight,
                    bottomHeight: plate.bottomHeight,
                    x: plate.x,
                    y: plate.y,
                    cylinderId: cylinderId
                };

                await createPlate(platePayload);
            }
        }

        debug.notify("success", "Volledige jobstructuur succesvol opgeslagen!");
        return jobRes.data;

    } catch (error) {
        debug.notify("error", "Fout bij createFullJob", {
            detail: parseApiError(error)
        });

        return null;
    }
}
