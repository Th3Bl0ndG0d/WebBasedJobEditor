import axios from "axios";

export async function getJobs(token) {
    console.log("🚀 getJobs() gestart");

    if (!token) {
        console.warn("⚠️ Geen token meegegeven aan getJobs()");
        return null;
    }

    try {
        console.log("📨 Verstuur GET-request naar jobs-endpoint...");
        console.log("🔑 Headers:", {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

        console.log("✅ Response ontvangen (status:", response.status, ")");
        console.log("📦 Response data:", response.data);

        return response.data;
    } catch (error) {
        console.error("❌ Fout bij ophalen van jobs:");

        if (error.response) {
            console.error("📡 Server response:", {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            console.error("📭 Geen response ontvangen van server:", error.request);
        } else {
            console.error("🛠️ Fout bij opzetten van request:", error.message);
        }

        return null;
    }
}
