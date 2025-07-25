import React, {useContext, useEffect, useState} from 'react';
import './Login.css';
import Button from "../../components/button/Button.jsx";
import { Link } from "react-router-dom";
import InputField from "../../components/inputField/InputField.jsx";
import FormGroup from "../../components/formGroup/formGroup.jsx";
import FormGrid from "../../components/formGrid/FromGrid.jsx";
import { createDebugger } from "../../components/debugger/createDebugger.jsx";
import {AuthContext} from "../../context/AuthProvider.jsx";
import loginUser from "../../helpers/loginUser.js";

// Debugger configureren zoals in login.js
const debug = createDebugger({
    enableConsole: true,
    enableToast: true,
    toastTypes: {
        success: true,
        error: true,
        info: true,
        warning: true,
        debug: true,
    }
});

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {logout,login} = useContext(AuthContext);

// Bij binnenkomst op de loginpagina checken we of er een logoutReden is opgeslagen
    useEffect(() => {
        const reason = sessionStorage.getItem('logoutReason');

        // We tonen alleen een melding als de reden "Session timed out" is
        if (reason === 'Session timed out') {
            debug.notify('info', reason); // Toon info-melding via debug-helper
        }

        // In alle gevallen ruimen we de reden direct op
        sessionStorage.removeItem('logoutReason');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        // Eerst huidige sessie wissen (indien aanwezig)
        logout();

        const responseData = await loginUser(email, password);
        console.log('Login response:', responseData);
        login(responseData);
    };

    return (
        <div className="outer-container login-wrapper">
            <div className="inner-container login-form">
                <form className="form-card login-form" onSubmit={handleLogin}>
                    <h1>Inloggen WBJE</h1>

                    <FormGrid direction="column" theme="light" spacing="loose">
                        <FormGroup label="Emailadres" htmlFor="email">
                            <InputField
                                id="email"
                                type="email"
                                inputValue={email}
                                handleInputChange={setEmail}
                                className="input-standard"
                                placeholder="Vul je email in"
                                required
                            />
                        </FormGroup>

                        <FormGroup label="Wachtwoord" htmlFor="password">
                            <InputField
                                id="password"
                                type="password"
                                inputValue={password}
                                handleInputChange={setPassword}
                                placeholder="Vul je wachtwoord in"
                                className="input-standard"
                                required
                            />
                        </FormGroup>

                        {error && (
                            <FormGroup label=" ">
                                <p className="error-message">{error}</p>
                            </FormGroup>
                        )}

                        <FormGroup label=" " className="centered">
                            <Button type="submit" label="Inloggen" />
                        </FormGroup>

                        <FormGroup label=" ">
                            <p className="forgot-password">
                                <Link to="/profile/register">Nieuwe gebruiker aanmaken</Link>
                            </p>
                        </FormGroup>
                    </FormGrid>
                </form>
            </div>
        </div>
    );
}

export default Login;
