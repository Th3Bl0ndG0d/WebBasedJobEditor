import axios from 'axios';
import { getCurrentUser } from './login.js';
import {getHeaders} from "./getHeaders.js";

// 🔧 Maakt een enkele plaat aan via de API
export async function createPlate(plate, toast) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        toast?.error("❌ Geen geldige gebruiker.");
        return null;
    }

    try {
        console.log("📤 Verstuur plate-payload naar API:", plate);
        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/plates',
            plate,
            { headers: getHeaders(currentUser.token) }
        );

        const plateId = res.data.id;
        console.log(`🧩 Plate aangemaakt (ID: ${plateId})`, res.data);
        toast?.success(`✅ Plate aangemaakt (ID: ${plateId})`);
        return plateId;
    } catch (err) {
        console.error("❌ Fout bij aanmaken plate:", err);
        toast?.error("❌ Plate creatie mislukt.");
        return null;
    }
}

// 🔧 Maakt een cylinder aan met referentie naar jobId
export async function createCylinder(cylinder, toast) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        toast?.error("❌ Geen geldige gebruiker.");
        return null;
    }

    try {
        console.log("📤 Verstuur cylinder-payload naar API:", cylinder);
        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/cylinders',
            cylinder,
            { headers: getHeaders(currentUser.token) }
        );

        const cylinderId = res.data.id;
        console.log(`🛢️ Cylinder aangemaakt (ID: ${cylinderId})`, res.data);
        toast?.success(`✅ Cylinder aangemaakt (ID: ${cylinderId})`);
        return cylinderId;
    } catch (err) {
        console.error("❌ Fout bij aanmaken cylinder:", err);
        toast?.error("❌ Cylinder creatie mislukt.");
        return null;
    }
}

// 🧠 Voert de volledige jobcreatie uit: eerst job, dan cylinders, dan plates
export async function createFullJob(jobObject, toast) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.token) {
        toast?.error("❌ Niet ingelogd.");
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

        const jobRes = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs',
            jobPayload,
            { headers: getHeaders(currentUser.token) }
        );

        const jobId = jobRes.data.id;
        toast?.success(`✅ Job aangemaakt (ID: ${jobId})`);
        console.log(`📦 Job ID ontvangen: ${jobId}`);

        // 2. 🛢️ Cylinders aanmaken per stuk, met jobId
        for (const cyl of jobObject.cylinders) {
            const cylinderPayload = {
                name: cyl.name,
                jobId: jobId
            };

            const cylinderId = await createCylinder(cylinderPayload, toast);
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

                await createPlate(platePayload, toast);
            }
        }

        toast?.success("🎉 Volledige jobstructuur succesvol opgeslagen!");
        return jobRes.data;
    } catch (error) {
        console.error("❌ Fout bij createFullJob:", error);
        toast?.error("❌ Job creatie mislukt.");
        return null;
    }
}
