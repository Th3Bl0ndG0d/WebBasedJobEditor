import axios from 'axios';
import { getHeaders } from './getHeaders.js';

/**
 * Werkt een bestaande gebruiker bij via de backend API.
 * Gebruikt het unieke ID van de gebruiker.
 *
 * @param {string} id - Unieke ID van de gebruiker (bv. '65f3a1d...')
 * @param {Object} updates - De aan te passen gegevens (bv. { password, role })
 * @param {string} token - JWT token voor authenticatie
 * @returns {Promise<boolean>} True indien succesvol bijgewerkt, anders false
 */
export async function updateUser(id, updates, token) {
    try {
        console.log(`✏️ Verzoek tot bijwerken van gebruiker met ID: ${id}`, updates);

        const response = await axios.patch(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/users/${id}`,
            updates,
            { headers: getHeaders(token) }
        );

        console.log("✅ Gebruiker succesvol bijgewerkt:", response.data);
        return true;

    } catch (err) {
        console.error("❌ Fout bij bijwerken gebruiker:", err);
        return false;
    }
}
