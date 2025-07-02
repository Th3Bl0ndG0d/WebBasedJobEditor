// src/helpers/deleteUser.js
import axios from 'axios';
import { getHeaders } from './getHeaders.js';

/**
 * Verwijdert een gebruiker via de backend API.
 * Volgens mij ondersteund de backend API dit not niet... :S
 * @param {string} id - Emailadres van de te verwijderen gebruiker
 * @param {string} token - JWT token voor authenticatie
 * @returns {Promise<boolean>} True indien succesvol verwijderd, anders false
 */
export async function deleteUser(id, token) {
    try {
        console.log(`🗑️ Verzoek tot verwijderen van gebruiker: ${id}`);

        const response = await axios.delete(
            `https://novi-backend-api-wgsgz.ondigitalocean.app/api/users/${id}`,
            { headers: getHeaders(token) }
        );

        console.log("✅ Gebruiker succesvol verwijderd:", response.data);
        return true;

    } catch (err) {
        console.error("❌ Fout bij verwijderen gebruiker:", err);
        return false;
    }
}
