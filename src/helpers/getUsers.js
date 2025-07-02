import axios from 'axios';
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

export async function getUsers() {
    try {
        console.log("📥 Gebruikers ophalen vanaf API...");

        const res = await axios.get(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/users',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'novi-education-project-id': PROJECT_ID,
                },
            }
        );

        console.log("📦 Gebruikers ontvangen:", res.data);
        return res.data;

    } catch (err) {
        console.error("❌ Fout bij ophalen gebruikers:", err);
        return [];
    }
}
