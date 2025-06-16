import React, { useState } from 'react';
import './Login.css';
import Button from "../../components/button/Button.jsx";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        //Hier moet een API call komen
        alert(`Ingelogd met:\nEmail: ${email}\nWachtwoord: ${password}`);
    };

    return (
        <div className="outer-container login-wrapper">
            <div className="inner-container login-form">
                <form className="form-card login-form" onSubmit={handleLogin}>
                    <h1>Inloggen WBJE</h1>

                    <label htmlFor="email">Emailadres</label>
                    <input className="input-standard"
                        type="email"
                        id="email"
                        placeholder="Vul je email in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Wachtwoord</label>
                    <input className="input-standard"
                        type="password"
                        id="password"
                        placeholder="Vul je wachtwoord in"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        label="Inloggen"
                    />
                    <p className="forgot-password">
                        <a href="#">Wachtwoord vergeten?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;