import React, { useState, useEffect } from 'react';
import './Profile.css';
import Button from "../../components/button/Button.jsx";

import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.jsx";
import SelectField from "../../components/selectField/SelectField.jsx";
import FormGroup from "../../components/FormGroup/formGroup.jsx";
import InputField from "../../components/inputField/InputField.jsx";

function Profile({ mode = 'edit' }) {
    const isEditMode = mode === 'edit';
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.roles?.includes('Beheerder');

    // Lokale toestand voor formulierwaarden
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Operator');
    const [error, setError] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    /**
     * Redirect indien een ingelogde gebruiker op de register-pagina komt.
     * Enkel ongeauthenticeerde gebruikers mogen registreren.
     */
    useEffect(() => {
        if (!isEditMode && user) {
            console.log('🔁 Redirect: ingelogde gebruiker probeert te registreren');
            navigate("/JobOverview");
        }
    }, [isEditMode, user, navigate]);

    /**
     * Bij eerste render: laad gebruikerslijst uit lokale opslag
     * Voor niet-beheerders: vul eigen profieldata in.
     */
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUserList(storedUsers);

        if (!isAdmin && isEditMode && user) {
            console.log('📄 Profiel geladen vanuit context:', user.email);
            setEmail(user.email);
            setUserType(user.roles?.[0] || 'Operator'); // of wat van toepassing is
        }
    }, [isEditMode, isAdmin, user]);

    /**
     * Wanneer een beheerder een gebruiker selecteert, laad die gegevens in het formulier.
     * Bij geen selectie: stel standaard lege waarden in.
     */
    useEffect(() => {
        if (selectedUser) {
            const userData = userList.find(u => u.username === selectedUser);
            if (userData) {
                console.log('👤 Gebruiker geselecteerd:', userData.username);
                setEmail(userData.email);
                setPassword('');
                setUserType(userData.role);
            }
        } else if (isAdmin && isEditMode) {
            console.log('🆕 Nieuwe gebruiker toevoegen (geen selectie)');
            setEmail('');
            setPassword('');
            setUserType('Operator');
        }
    }, [selectedUser, userList, isAdmin, isEditMode]);

    /**
     * Verwerking van formulier:
     * - Nieuw toevoegen (register-mode of admin zonder selectie)
     * - Bewerken (alleen bij bestaande selectie)
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        let updatedUsers = [...userList];

        // Nieuw registreren
        if (!isEditMode || (isEditMode && isAdmin && !selectedUser)) {
            // if (updatedUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            //     console.warn('⚠️ Gebruikersnaam bestaat al:', username);
            //     setError('Gebruikersnaam bestaat al. Kies een andere naam.');
            //     return;
            // }

            const newUser = { email, password, role: userType };
            updatedUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUserList(updatedUsers);

            console.log('✅ Nieuwe gebruiker aangemaakt:', newUser);
            alert(`Nieuwe gebruiker aangemaakt:\nEmail: ${email}\nRol: ${userType}`);

            if (!isEditMode) {
                login(newUser);
                navigate(userType === "Beheerder" ? "/profile/edit" : "/JobOverview");
            }

            return;
        }

        // Bewerken bestaande gebruiker
        const index = updatedUsers.findIndex(u => u.email === email);
        if (index >= 0) {
            updatedUsers[index] = {
                ...updatedUsers[index],
                email,
                role: userType,
                ...(password && { password })  // Alleen bij ingevuld wachtwoord
            };

            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUserList(updatedUsers);

            console.log('✏️ Gebruiker bijgewerkt:', updatedUsers[index]);
            alert(`Gebruiker bijgewerkt:\nEmail: ${email}\nRol: ${userType}`);
        } else {
            console.error('❌ Geen bestaande gebruiker geselecteerd.');
            alert(`Geen bestaande gebruiker geselecteerd.`);
        }
    };

    /**
     * Verwijder geselecteerde gebruiker (alleen beheerder)
     */
    const handleDelete = () => {
        if (!selectedUser) return;
        const confirmed = window.confirm(`Weet je zeker dat je gebruiker "${selectedUser}" wilt verwijderen?`);
        if (!confirmed) return;

        const updatedUsers = userList.filter(u => u.username !== selectedUser);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUserList(updatedUsers);

        console.log('🗑️ Gebruiker verwijderd:', selectedUser);

        setSelectedUser('');
        setEmail('');
        setPassword('');
        setUserType('Operator');

        alert(`Gebruiker "${selectedUser}" is verwijderd.`);
    };

    return (
        <div className="outer-container profile-container">
            <div className="inner-container profile-form">
                <form className="form-card profile-form" onSubmit={handleSubmit}>
                    {/*<h1 className="profile-title">*/}
                    {/*    {isEditMode ? 'Profiel Bewerken' : 'Registreren'}*/}
                    {/*</h1>*/}

                    <h1 className="profile-title">
                        {isEditMode && isAdmin && !selectedUser
                            ? 'Nieuwe gebruiker'
                            : !isEditMode
                                ? 'Registreren'
                                : 'Profiel Bewerken'}
                    </h1>

                    {/* Dropdown voor beheerder om gebruiker te kiezen */}
                    {isAdmin && isEditMode && (
                        <FormGroup label="Selecteer gebruiker" htmlFor="userSelect">
                            <SelectField
                                id="userSelect"
                                value={selectedUser}
                                handleChange={setSelectedUser}
                                options={[
                                    { value: "", label: "-- Nieuwe gebruiker toevoegen --" },
                                    ...userList.map((u) => ({
                                        value: u.username,
                                        label: u.username,
                                    })),
                                ]}
                            />
                        </FormGroup>
                    )}


                   {/* Email */}
                    <FormGroup label="Emailadres" htmlFor="email">
                        <InputField
                            id="email"
                            type="email"
                            inputValue={email}
                            handleInputChange={setEmail}
                            className="input-standard"
                            required
                        />
                    </FormGroup>

                    {/* Wachtwoord: altijd zichtbaar */}
                    <FormGroup label="Wachtwoord" htmlFor="password">
                        <InputField
                            id="password"
                            type="password"
                            inputValue={password}
                            handleInputChange={setPassword}
                            className="input-standard"
                            required={!isEditMode || (isAdmin && !selectedUser)}
                            placeholder={
                                isEditMode && password === ''
                                    ? 'Laat leeg om wachtwoord niet te wijzigen'
                                    : 'Wachtwoord'
                            }
                        />
                    </FormGroup>

                    {/* Rol-selectie */}
                    <FormGroup label="Gebruikerstype" htmlFor="userType">
                        <SelectField
                            id="userType"
                            value={userType}
                            handleChange={setUserType}
                            disabled={!isAdmin && isEditMode}
                            options={[
                                { value: "Operator", label: "Operator" },
                                { value: "Beheerder", label: "Beheerder" },
                                { value: "Programmer", label: "Programmer" },
                            ]}
                        />
                    </FormGroup>

                    {/* Foutmelding */}
                    {error && <p className="error-message">{error}</p>}

                    {/* Actieknoppen */}
                    <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <Button
                            type="submit"
                            label={
                                isEditMode
                                    ? (isAdmin && !selectedUser ? 'Toevoegen' : 'Opslaan')
                                    : 'Aanmaken'
                            }
                        />
                        {isEditMode && isAdmin && selectedUser && (
                            <Button
                                type="button"
                                label="Verwijderen"
                                onClick={handleDelete}
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
