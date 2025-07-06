import axios from 'axios';
import { getCurrentUser } from './login.js';
import { getHeaders } from "./getHeaders.js";

// 🔧 Maakt een enkele plaat aan via de API
export async function createPlate(plate, CustomToast) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        CustomToast?.error("❌ Geen geldige gebruiker.");
        return null;
    }

    try {
        const headers = getHeaders(currentUser.token);
        console.log("📤 Endpoint: /api/plates");
        console.log("📤 Headers:", headers);
        console.log("📤 Payload:", plate);

        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/plates',
            plate,
            { headers }
        );

        const plateId = res.data.id;
        console.log(`🧩 Plate aangemaakt (ID: ${plateId})`, res.data);
        CustomToast?.success(`✅ Plate aangemaakt (ID: ${plateId})`);
        return plateId;
    } catch (err) {
        console.error("❌ Fout bij aanmaken plate:", err);
        CustomToast?.error("❌ Plate creatie mislukt.");
        return null;
    }
}

// 🔧 Maakt een cylinder aan met referentie naar jobId
export async function createCylinder(cylinder, CustomToast) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        CustomToast?.error("❌ Geen geldige gebruiker.");
        return null;
    }

    try {
        const headers = getHeaders(currentUser.token);
        console.log("📤 Endpoint: /api/cylinders");
        console.log("📤 Headers:", headers);
        console.log("📤 Payload:", cylinder);

        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/cylinders',
            cylinder,
            { headers }
        );

        const cylinderId = res.data.id;
        console.log(`🛢️ Cylinder aangemaakt (ID: ${cylinderId})`, res.data);
        CustomToast?.success(`✅ Cylinder aangemaakt (ID: ${cylinderId})`);
        return cylinderId;
    } catch (err) {
        console.error("❌ Fout bij aanmaken cylinder:", err);
        CustomToast?.error("❌ Cylinder creatie mislukt.");
        return null;
    }
}

// 🧠 Voert de volledige jobcreatie uit: eerst job, dan cylinders, dan plates
export async function createFullJob(jobObject, CustomToast) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        CustomToast?.error("❌ Niet ingelogd.");
        return null;
    }

    try {
        console.log("🚀 Start volledige jobcreatie met input:", jobObject);

        // 1. 📦 Maak eerst de job aan (zonder cylinders of plates)
        const jobPayload = {
            number: jobObject.number,
            name: jobObject.name,
            info: jobObject.info,
            date: jobObject.date,
            repeat: jobObject.repeat
        };

        const headers = getHeaders(currentUser.token);
        console.log("📤 Endpoint: /api/jobs");
        console.log("📤 Headers:", headers);
        console.log("📤 Payload:", jobPayload);

        const jobRes = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs',
            jobPayload,
            { headers }
        );

        const jobId = jobRes.data.id;
        CustomToast?.success(`✅ Job aangemaakt (ID: ${jobId})`);
        console.log(`📦 Job ID ontvangen: ${jobId}`);

        // 2. 🛢️ Cylinders aanmaken per stuk, met jobId
        for (const cyl of jobObject.cylinders) {
            const cylinderPayload = {
                name: cyl.name,
                jobId: jobId
            };

            const cylinderId = await createCylinder(cylinderPayload, CustomToast);
            if (!cylinderId) continue;

            // 3. 🧩 Plates aanmaken per stuk, met cylinderId
            for (const plate of cyl.plates) {
                const platePayload = {
                    width: plate.width,
                    topHeight: plate.topHeight,
                    bottomHeight: plate.bottomHeight,
                    x: plate.x,
                    y: plate.y,
                    cylinderId: cylinderId
                };

                await createPlate(platePayload, CustomToast);
            }
        }

        CustomToast?.success("🎉 Volledige jobstructuur succesvol opgeslagen!");
        return jobRes.data;
    } catch (error) {
        console.error("❌ Fout bij createFullJob:", error);
        CustomToast?.error("❌ Job creatie mislukt.");
        return null;
    }
}
