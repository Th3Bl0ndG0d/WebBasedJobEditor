import isTokenValid from "./isTokenValid.js";

export default function getValidTokenOrLogout(logoutFn) {
    const token = localStorage.getItem('token');

    if (token && isTokenValid()) {
        return token;
    }

    logoutFn('Session timed out');//Send the reason for the logout!!!
    return null;
}