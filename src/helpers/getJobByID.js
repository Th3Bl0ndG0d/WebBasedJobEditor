import axios from 'axios';
import { getCurrentUser } from './login.js';
import {getHeaders} from "./getHeaders.js";
import CustomToast from "../components/cutomToast/CustomToast.jsx";




// 🔍 Haalt één job op, inclusief gekoppelde cylinders en plates via filters
export async function getJobById(jobId) {
    const currentUser = getCurrentUser();

    // ⛔ Gebruiker niet ingelogd of token ontbreekt
    if (!currentUser || !currentUser.token) {
        CustomToast?.error("Geen geldige gebruiker.");
        return null;
    }

    try {
        console.log(`📥 Start ophalen van job met ID: ${jobId}`);

        // 📦 Stap 1: Haal de job zelf op via ID
        const jobRes = await axios.get(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs/${jobId}`,
            {
                headers: getHeaders(currentUser.token)
            }
        );

        const job = jobRes.data;
        console.log("✅ Job succesvol opgehaald:", job);

        // 🛢️ Stap 2: Haal alle cylinders op die gekoppeld zijn aan deze job via filter
        const cylRes = await axios.get(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/cylinders',
            {
                headers: getHeaders(currentUser.token),
                params: {
                    'filter[jobId]': job.id
                }
            }
        );

        const cylinders = cylRes.data;
        console.log(`🔍 ${cylinders.length} cylinders opgehaald voor job ${job.id}:`, cylinders);

        // 🧩 Stap 3: Haal voor elke cylinder de bijbehorende plates op via cylinderId
        for (const cylinder of cylinders) {
            console.log(`🔄 Ophalen van plates voor cylinder ID: ${cylinder.id}`);

            const platesRes = await axios.get(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/plates',
                {
                    headers: getHeaders(currentUser.token),
                    params: {
                        'filter[cylinderId]': cylinder.id
                    }
                }
            );

            const plates = platesRes.data;
            console.log(`🧩 ${plates.length} plates gevonden voor cylinder ${cylinder.id}:`, plates);

            // 📌 Voeg opgehaalde plates toe aan de huidige cylinder
            cylinder.plates = plates;
        }

        // ✅ Stap 4: Voeg alle cylinders (met hun plates) toe aan de job
        job.cylinders = cylinders;

        CustomToast?.success("✅ Volledige jobstructuur succesvol geladen.");
        console.log("🎯 Volledige jobobject samengesteld:", job);
        return job;

    } catch (err) {
        console.error("❌ Fout bij ophalen van jobgegevens:", err);
        CustomToast?.error("Job ophalen mislukt.");
        return null;
    }
}
