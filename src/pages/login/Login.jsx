import React, {useEffect, useState} from 'react';
import './Login.css';
import Button from "../../components/button/Button.jsx";
import { useNavigate, Link } from "react-router-dom";
import {useAuth} from "../../helpers/AuthProvider.jsx";

// import { ensureDefaultUsersInStorage } from "../../helpers/defaultUsers.js";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Reageer op update van user na login anders loopo je altijd een stap achter. Denk aan de les..
    useEffect(() => {
        if (user) {
            console.log(`Ingelogd als: ${user.email}${user.roles ? ` (${user.roles.join(', ')})` : ''}`);

            if (user.roles?.includes('Beheerder')) {
                navigate("/profile/edit");
            } else {
                navigate("/JobOverview");
            }
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const success = await login(email, password);

        if (!success) {
            setError('Inloggen mislukt. Controleer je e-mailadres en wachtwoord.');
        }
    };
    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     const users = JSON.parse(localStorage.getItem('users')) || [];
    //     const foundUser = users.find(user => user.email === email);
    //
    //     if (!foundUser) {
    //         console.warn('Geen gebruiker gevonden met e-mailadres:', email);
    //         setError('Geen gebruiker gevonden met dit e-mailadres.');
    //         return;
    //     }
    //
    //     if (foundUser.password !== password) {
    //         console.warn("Ongeldig wachtwoord voor:', email);
    //         setError('Wachtwoord komt niet overeen.');
    //         return;
    //     }
    //
    //     // ✅ Volledige gebruiker doorgeven aan context
    //     login(foundUser);
    //     console.log(`✅ Ingelogd als: ${foundUser.username} (${foundUser.role})`);
    //
    //     // Navigatie op basis van rol
    //     if (foundUser.role === 'Beheerder') {
    //         navigate("/profile/edit");
    //     } else {
    //         navigate("/JobOverview");
    //     }
    // };



    return (
        <div className="outer-container login-wrapper">
            <div className="inner-container login-form">
                <form className="form-card login-form" onSubmit={handleLogin}>
                    <h1>Inloggen WBJE</h1>

                    <label htmlFor="email">Emailadres</label>
                    <input
                        className="input-standard"
                        type="email"
                        id="email"
                        placeholder="Vul je email in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Wachtwoord</label>
                    <input
                        className="input-standard"
                        type="password"
                        id="password"
                        placeholder="Vul je wachtwoord in"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <Button type="submit" label="Inloggen" />

                    <p className="forgot-password">
                        <Link to="/profile/register">Nieuwe gebruiker aanmaken</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
