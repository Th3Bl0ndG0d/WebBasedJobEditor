import React, { useState, useEffect } from 'react';
import './Profile.css';
import Button from "../../components/button/Button.jsx";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider.jsx";
import SelectField from "../../components/selectField/SelectField.jsx";
import FormGroup from "../../components/formGroup/formGroup.jsx";
import InputField from "../../components/inputField/InputField.jsx";
import ButtonGroup from "../../components/buttonGroup/ButtonGroup.jsx";
import { getUsers } from "../../helpers/getUsers.js";

import {addUser} from "../../helpers/addUser.js";
import CustomToast from "../../components/cutomToast/CustomToast.jsx";
import {updateUser} from "../../helpers/updateUser.js";
import {deleteUser} from "../../helpers/deleteUser.js";
import FormGrid from "../../components/formGrid/FromGrid.jsx";

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
     * Bij eerste render: laad gebruikerslijst uit API
     * Voor niet-beheerders: vul eigen profieldata in.
     */
    useEffect(() => {
        async function loadUsers() {
            if (!user?.token) return;
            const users = await getUsers(user.token);
            setUserList(users);
        }

        loadUsers();

        if (!isAdmin && isEditMode && user) {
            console.log('📄 Profiel geladen vanuit context:', user.email);
            setEmail(user.email);
            setUserType(user.roles?.[0] || 'Operator');
        }
    }, [isEditMode, isAdmin, user]);

    /**
     * Wanneer een beheerder een gebruiker selecteert, laad die gegevens in het formulier.
     * Bij geen selectie: stel standaard lege waarden in.
     */
    useEffect(() => {
        if (selectedUser) {
            const userData = userList.find(u => u.email === selectedUser);
            if (userData) {
                console.log('👤 Gebruiker geselecteerd:', userData.email);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Nieuw registreren
        if (!isEditMode || (isEditMode && isAdmin && !selectedUser)) {
            const newUser = { email, password, roles: [userType] };

            try {
                const createdUser = await addUser(newUser);
                if (createdUser) {
                    setUserList(prev => [...prev, createdUser]);
                    CustomToast.success(`Gebruiker aangemaakt: ${createdUser.email}`);

                    if (!isEditMode) {
                        // Gebruik context login zoals in Login.jsx
                        const success = await login(email, password);
                        if (success) {
                            navigate(userType === "Beheerder" ? "/profile/edit" : "/JobOverview");
                        } else {
                            CustomToast.error("Automatisch inloggen mislukt.");
                            navigate("/login");
                        }
                    }
                }
            } catch (err) {
                console.error('❌ Gebruiker toevoegen mislukt:', err);
                CustomToast.error("Gebruiker aanmaken mislukt.");
            }

            return;
        }

        // Bewerken bestaande gebruiker (admin met selectie)
        if (isEditMode && isAdmin && selectedUser) {
            const userData = userList.find(u => u.email === selectedUser);
            if (!userData || !userData._id) {
                CustomToast.error("Gebruiker-ID niet gevonden.");
                return;
            }

            const updates = {};
            if (password) updates.password = password;
            // rol updaten als array
            if (!userData.roles || userData.roles[0] !== userType) updates.roles = [userType];

            if (Object.keys(updates).length === 0) {
                CustomToast.info("Geen wijzigingen om op te slaan.");
                return;
            }

            try {
                const success = await updateUser(userData._id, updates, user.token);
                if (success) {
                    CustomToast.success(`Gebruiker "${selectedUser}" is bijgewerkt.`);
                    // Optioneel: userList verversen
                    const refreshedUsers = await getUsers(user.token);
                    setUserList(refreshedUsers);
                    setPassword('');
                } else {
                    CustomToast.error("Bijwerken mislukt.");
                }
            } catch (err) {
                console.error("❌ Fout bij bijwerken:", err);
                CustomToast.error("Bijwerken mislukt.");
            }
        }
    };


    /**
     * Verwijder geselecteerde gebruiker (alleen beheerder)
     */
    const handleDelete = async () => {
        if (!selectedUser) return;

        const userData = userList.find(u => u.email === selectedUser);
        if (!userData || !userData._id) {
            CustomToast.error("Gebruiker-ID niet gevonden.");
            return;
        }

        const confirmed = window.confirm(`Weet je zeker dat je gebruiker "${selectedUser}" wilt verwijderen?`);
        if (!confirmed) return;

        try {
            const success = await deleteUser(userData._id, user.token);
            if (success) {
                CustomToast.success(`Gebruiker "${selectedUser}" is verwijderd.`);
                setUserList(prev => prev.filter(u => u._id !== userData._id));
                setSelectedUser('');
                setEmail('');
                setPassword('');
                setUserType('Operator');
            } else {
                CustomToast.error("Verwijderen mislukt.");
            }
        } catch (err) {
            console.error("❌ Fout bij verwijderen:", err);
            CustomToast.error("Verwijderen mislukt.");
        }
    };



    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="outer-container profile-container">
            <div className="inner-container profile-form">
                <form className="form-card profile-form" onSubmit={handleSubmit}>
                    <h1 className="profile-title">
                        {isEditMode && isAdmin && !selectedUser
                            ? 'Nieuwe gebruiker'
                            : !isEditMode
                                ? 'Registreren'
                                : 'Profiel Bewerken'}
                    </h1>

                    {/* Formulier met flexibele layout */}
                    <FormGrid direction="column" theme="light" spacing="loose">
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
                                            value: u.email,
                                            label: u.email,
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
                        {error && (
                            <FormGroup label=" ">
                                <p className="error-message">{error}</p>
                            </FormGroup>
                        )}

                        {/* Actieknoppen */}
                        <FormGroup label=" ">
                            <ButtonGroup>
                                <Button
                                    type="submit"
                                    label={
                                        isEditMode
                                            ? (isAdmin && !selectedUser ? 'Toevoegen' : 'Opslaan')
                                            : 'Aanmaken'
                                    }
                                />
                                {(isEditMode && selectedUser && isAdmin) ? (
                                    <Button
                                        type="button"
                                        label="Verwijderen"
                                        onClick={handleDelete}
                                    />
                                ) : (
                                    <Button
                                        type="button"
                                        label="Annuleren"
                                        onClick={handleCancel}
                                    />
                                )}
                            </ButtonGroup>
                        </FormGroup>
                    </FormGrid>
                </form>
            </div>
        </div>
    );
}

export default Profile;
