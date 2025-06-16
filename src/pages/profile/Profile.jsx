import React, { useState } from 'react';
import './Profile.css';
import Button from "../../components/button/Button.jsx";

function Profile({ mode = 'edit' }) {
    const isEditMode = mode === 'edit';

    const [username, setUsername] = useState(isEditMode ? 'janedoe' : '');
    const [email, setEmail] = useState(isEditMode ? 'janedoe@example.com' : '');
    const [userType, setUserType] = useState('Operator');
    const [error, setError] = useState('');

    // Simulatie van bestaande gebruikers
    const existingUsers = ['janedoe', 'admin123', 'operator1'];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!isEditMode) {
            // Registratie: check of gebruiker al bestaat
            if (existingUsers.includes(username.toLowerCase())) {
                setError('Gebruikersnaam bestaat al. Kies een andere naam.');
                return;
            }
            alert(`Nieuwe gebruiker aangemaakt:\nGebruikersnaam: ${username}\nEmail: ${email}\nRol: ${userType}`);
        } else {
            // Aanpassen
            alert(`Gegevens opgeslagen:\nGebruikersnaam: ${username}\nEmail: ${email}\nRol: ${userType}`);
        }

        // Hier zou een API-call komen
    };

    return (
        <div className="outer-container profile-container">
            <div className="inner-container profile-form">
                <form className="form-card profile-form" onSubmit={handleSubmit}>
                    <h1 className="profile-title">
                        {isEditMode ? 'Profiel Bewerken' : 'Registreren'}
                    </h1>

                    <div className="form-group">
                        <label htmlFor="username">Gebruikersnaam</label>
                        <input className="input-standard"
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Emailadres</label>
                        <input className="input-standard"
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userType">Gebruikerstype</label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={e => setUserType(e.target.value)}
                        >
                            <option value="Operator">Operator</option>
                            <option value="Beheerder">Beheerder</option>
                            <option value="Programmer">Programmer</option>
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <Button
                        type="submit"
                        label={isEditMode ? 'Opslaan' : 'Aanmaken'}
                    />
                </form>
            </div>
        </div>
    );
}

export default Profile;