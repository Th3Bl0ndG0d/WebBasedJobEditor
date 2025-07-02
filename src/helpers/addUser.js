import axios from 'axios';
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

export async function addUser(user) {
    try {
        console.log("📤 Verstuur gebruiker naar API:", user);

        const payload = {
            email: user.email,
            password: user.password,
            roles: [user.roles || user.role].flat(),
        };

        const res = await axios.post(
            'https://novi-backend-api-wgsgz.ondigitalocean.app/api/users',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'novi-education-project-id': PROJECT_ID,
                }
            }
        );

        console.log("✅ Gebruiker aangemaakt:", res.data);
        return res.data;

    } catch (err) {
        console.error("❌ Fout bij aanmaken gebruiker:", err);
        return null;
    }
}
