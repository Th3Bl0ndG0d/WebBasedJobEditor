import React, {useContext, useEffect, useState} from 'react';
import './Login.css';
import Button from "../../components/button/Button.jsx";
import { useNavigate, Link } from "react-router-dom";
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
    const {logout,login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (user) {
    //         console.log(`Ingelogd als: ${user.email}${user.roles ? ` (${user.roles.join(', ')})` : ''}`);
    //         if (user.roles?.includes('beheerder')) {
    //             navigate("/profile/edit");
    //         } else {
    //             navigate("/JobOverview");
    //         }
    //     }
    // }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        // Eerst huidige sessie wissen (indien aanwezig)
        logout();

        const responseData = await loginUser(email, password);
        console.log('Login response:', responseData);
        login(responseData);
        // const success = await loginUser(email, password);
        // if (!success) {
        //     const msg = 'Inloggen mislukt. Controleer je e-mailadres en wachtwoord.';
        //     debug.notify('error', msg); // toast errormelding
        //     setError(msg); // visuele foutmelding
        // }
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

                        <FormGroup label=" ">
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
