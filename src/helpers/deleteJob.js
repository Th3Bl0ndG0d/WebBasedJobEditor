// src/helpers/deleteJob.js
import axios from 'axios';
import { getHeaders } from './getHeaders.js';
import { getCurrentUser } from './login.js';
import { getJobById } from './getJobByID.js';

/**
 * Verwijdert een enkele plaat.
 */
async function deletePlate(plateId, token) {
    try {
        await axios.delete(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/plates/${plateId}`,
            { headers: getHeaders(token) }
        );
        console.log(`   ✅ Plaat ${plateId} verwijderd.`);
    } catch (error) {
        handleAxiosError(error, `plaat ${plateId}`);
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
        console.log(`   ✅ Cylinder ${cylinderId} verwijderd.`);
    } catch (error) {
        handleAxiosError(error, `cylinder ${cylinderId}`);
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
        console.log(`   ✅ Job ${jobId} verwijderd.`);
    } catch (error) {
        handleAxiosError(error, `job ${jobId}`);
        throw error;
    }
}

/**
 * Verwijdert een volledige job inclusief alle onderliggende cylinders en plates.
 * Haalt de volledige structuur op via getJobById().
 * @param {string} jobId - ID van de te verwijderen job
 * @returns {Promise<boolean>} True indien succesvol verwijderd, anders false
 */
export async function deleteJob(jobId) {
    try {
        console.log(`🗑️ Verzoek tot verwijderen van job: ${jobId}`);

        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.token) {
            console.warn("❌ Geen geldige gebruiker/token gevonden.");
            return false;
        }

        const job = await getJobById(jobId);
        if (!job) {
            console.warn("❌ Job kon niet worden opgehaald.");
            return false;
        }

        for (const cylinder of job.cylinders) {
            for (const plate of cylinder.plates) {
                await deletePlate(plate.id, currentUser.token);
            }
            await deleteCylinder(cylinder.id, currentUser.token);
        }

        await deleteJobRecord(jobId, currentUser.token);

        console.log("✅ Verwijderen van job succesvol afgerond.");
        return true;

    } catch (err) {
        console.error("❌ Verwijderen van job mislukt:", err);
        return false;
    }
}

/**
 * Algemene Axios-foutafhandeling met logging.
 */
function handleAxiosError(error, context = '') {
    console.error(`❌ Fout bij ${context}:`, error);

    if (error.response) {
        console.error("📡 Server response:", {
            status: error.response.status,
            data: error.response.data,
        });
    } else if (error.request) {
        console.error("📭 Geen serverantwoord ontvangen:", error.request);
    } else {
        console.error("🛠️ Fout bij opzetten van request:", error.message);
    }
}
