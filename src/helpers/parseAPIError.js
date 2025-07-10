/**
 * Haalt de meest bruikbare foutmelding uit een Axios-errorobject.
 * Herkent en onderscheidt serverresponse, ontbrekend antwoord of andere fouten.
 *
 * @param {any} err - De fout die is opgetreden (meestal AxiosError)
 * @returns {string} - De foutmelding voor gebruiker of log
 */
export function parseApiError(err) {
    // 1. Server heeft geantwoord met foutstatus
    const data = err?.response?.data;

    if (data) {
        if (typeof data === 'string') {
            return data;
        }

        if (typeof data === 'object') {
            if (data.error) return String(data.error);
            if (data.message) return String(data.message);
        }

        return `Serverfout (${err.response.status})`;
    }

    // 2. Request is verzonden, maar geen antwoord ontvangen
    if (err?.request) {
        return "Geen antwoord van de server ontvangen.";
    }

    // 3. Fout bij opzetten van het verzoek zelf
    if (err?.message) {
        return `Verzoek mislukt: ${err.message}`;
    }

    // 4. Onbekende structuur
    return "Onbekende fout opgetreden.";
}
