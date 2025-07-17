import { jwtDecode } from 'jwt-decode';

/**
 * Controleert of de JWT-token nog geldig is.
 * Deze functie wordt gebruikt bij het opstarten van de applicatie
 * om te bepalen of de ingelogde gebruiker nog een geldige sessie heeft.
 *
 * @returns {boolean} true als token bestaat én nog niet is verlopen
 */
function isTokenValid() {
    // 1. Haal de token op uit localStorage
    const token = localStorage.getItem('token');

    // 2. Als er geen token is, dan is deze sowieso ongeldig
    // Token moet bestaan én een string zijn
    if (!token || typeof token !== 'string') {
        return false;
    }

    // Token moet op een JWT lijken (3 delen gescheiden door '.')
    if (token.split('.').length !== 3) {
        console.warn('Ongeldig JWT-formaat');
        return false;
    }


    try {
        // 3. Decodeer de JWT-token
        const decodedToken = jwtDecode(token);

        // 4. De "exp" geeft aan wanneer de token verloopt (in seconden sinds 1970) Jeeej goggle
        const expirationTime = decodedToken.exp;
        // 5. Haal de huidige tijd op in seconden
        const currentTime = Date.now() / 1000;
        // 6. Als de huidige tijd kleiner is dan de exp, is de token nog geldig
        if(!(currentTime < expirationTime)) console.log('TimeOut tokkie verlopen');
        return currentTime < expirationTime;

    } catch (error) {
        // 7. Als het decoderen mislukt (bv. corrupte token), log de fout en return false
        console.error('Fout bij valideren van JWT-token:', error);
        return false;
    }
}

export default isTokenValid;
