import axios from 'axios';
import { getCurrentUser } from './login.js';

export async function createJob(jobObject) {
    console.log("🚀 createJob gestart met object:", jobObject);

    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.token) {
        console.warn("❌ Geen geldige gebruiker/token gevonden.");
        return null;
    }

    try {
        const response = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/jobs',
            jobObject,
            {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("✅ Job succesvol aangemaakt:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Fout bij aanmaken van job:", error);

        if (error.response) {
            console.error("📡 Server response:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("📭 Geen serverantwoord:", error.request);
        } else {
            console.error("🛠️ Fout bij opzetten van request:", error.message);
        }

        return null;
    }
}