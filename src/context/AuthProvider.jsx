import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import isTokenValid from '../helpers/isTokenValid';
import getUserData from '../helpers/getUserData';

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuth: false,
        user: null,
        status: 'pending',
    });

    const navigate = useNavigate();
    // Log elke verandering in auth state
    useEffect(() => {
        console.log('[AuthProvider] Auth state gewijzigd:', auth);
    }, [auth]);

    // We hebben nodig: useEffect in de mount-cycle (want checken op refresh)
    useEffect(() => {
        console.log('Context wordt gerefresht!');

        // Eerst kijken we of er nog een token aanwezig is, in de local storage
        const token = localStorage.getItem('token');

        // Als er een token is én die nog geldig is...
        if (token && isTokenValid()) {
            // ...dan decoderen we de token om bij de gebruikers-informatie te komen
            const decodedToken = jwtDecode(token);
            console.log('Decoded token bij refresh:', decodedToken);

            // vervolgens halen we gebruikersgegevens op via de API
            const userId = decodedToken.userId;

            getUserData(userId, token)
                .then((userData) => {
                    setAuth({
                        isAuth: true,
                        user: {
                            id: userData.id,
                            email: userData.email,
                            roles: userData.roles,
                        },
                        status: 'done',
                    });
                })
                .catch((err) => {
                    console.error('Fout bij ophalen gebruikersdata tijdens refresh:', err);
                    logout(); // Token ongeldig of gebruiker bestaat niet meer? Uitloggen.
                });
        } else {
            // Geen token aanwezig of niet (meer) geldig? Dan zal er wel niemand ingelogd zijn
            setAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []); // <--- dit is een MOUNT effect

    // login-functie die aangeroepen wordt na succesvolle login
    async function login(userDetails) {
        console.log('De login-functie uit de Context heeft ontvangen:', userDetails);

        // 1. Token moet ergens opgeslagen worden (VEILIG)
        localStorage.setItem('token', userDetails.token);

        // 2. We willen gebruikersinfo ophalen — daarvoor hebben we de ID nodig
        //    En die zit in de JWT-token! Dus eerst: token decoderen met jwt-decode
        const decodedToken = jwtDecode(userDetails.token);
        const userId = decodedToken.userId;
        console.log('Decoded token:', decodedToken);

        try {
            // 3. Met de userId én token halen we gebruikersgegevens op bij de backend
            const userData = await getUserData(userId, userDetails.token);
            console.log('Gebruikersgegevens van API:', userData);

            // 4. Belangrijke user-info zetten we nu in de state
            setAuth({
                isAuth: true,
                user: {
                    id: userData.id,
                    email: userData.email,
                    roles: userData.roles,
                },
                status: 'done',
            });

            // 5. Doorsturen naar de profielpagina
            // Na setAuth(...)
            if (userData.roles.includes('beheerder')) {
                navigate('/profile/edit');
            } else {
                navigate('/JobOverview');
            }
        } catch (error) {
            console.error('Login faalde bij ophalen gebruikersdata:', error);
        }
    }

    function logout(reason = null) {
        // 1. De token moet verwijderd worden
        localStorage.removeItem('token');

        // 2. Indien reden meegegeven (zoals "Session timed out"), tijdelijk opslaan in sessionStorage
        if (reason) {
            sessionStorage.setItem('logoutReason', reason);
        } else {
            sessionStorage.removeItem('logoutReason'); // anders expliciet wissen
        }

        // 3. We maken de state weer leeg
        setAuth({
            isAuth: false,
            user: null,
            status: 'done',
        });

        console.log('Gebruiker is uitgelogd!');
        navigate('/login'); // 4. Doorsturen naar loginpagina
    }


    const contextData = {
        isAuth: auth.isAuth,
        user: auth.user,
        login: login,
        logout: logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {auth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
