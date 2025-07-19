import React, {useState, useEffect, useContext} from 'react';
import './Profile.css';
import Button from "../../components/button/Button.jsx";

import { useNavigate } from "react-router-dom";
import {AuthContext} from "../../context/AuthProvider.jsx";
import SelectField from "../../components/selectField/SelectField.jsx";
import FormGroup from "../../components/formGroup/formGroup.jsx";
import InputField from "../../components/inputField/InputField.jsx";
import ButtonGroup from "../../components/buttonGroup/ButtonGroup.jsx";
import { getUsers } from "../../helpers/getUsers.js";
import { addUser } from "../../helpers/addUser.js";
import { deleteUser } from "../../helpers/deleteUser.js";
import FormGrid from "../../components/formGrid/FromGrid.jsx";
import {parseApiError } from "../../helpers/parseApiError.js";
import {createDebugger} from "../../components/debugger/createDebugger.jsx";
import getValidTokenOrLogout from "../../helpers/getValidTokenOrLogout.js";
import loginUser from "../../helpers/loginUser.js";

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

function Profile({ mode = 'edit' }) {
    const isEditMode = mode === 'edit';
    const { user, login,logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.roles?.includes('beheerder');

    // Lokale toestand voor formulierwaarden
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('operator');
    const [error, setError] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    /**
     * Redirect indien een ingelogde gebruiker op de register-pagina komt.
     * Enkel ongeauthenticeerde gebruikers mogen registreren.
     */
    useEffect(() => {
        if (!isEditMode && user) {
            debug.notify("info", "Redirect: ingelogde gebruiker probeert te registreren");
            navigate("/JobOverview");
        }
    }, [isEditMode, user, navigate]);

    /**
     * Bij eerste render: laad gebruikerslijst uit API
     * Voor niet-beheerders: vul eigen profieldata in.
     */
    useEffect(() => {
        async function loadUsers() {
            if (!isEditMode) return; // ➤ Bij registratie: niets doen
            const token = getValidTokenOrLogout(logout);
            if (!token) return;

            const users = await getUsers();
            setUserList(users);
        }

        loadUsers();

        if (!isAdmin && isEditMode && user) {
            debug.notify("debug", `Profiel geladen vanuit context: ${user.email}`);
            setEmail(user.email);
            setUserType(user.roles?.[0] || 'operator');
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
                debug.notify("debug", `Gebruiker geselecteerd: ${userData.email}`);
                setEmail(userData.email);
                setPassword('');
                setUserType(userData.roles?.[0].toLowerCase() || 'operator');

            }
        } else if (isAdmin && isEditMode) {
            debug.notify("debug", "Nieuwe gebruiker toevoegen (geen selectie)");
            setEmail('');
            setPassword('');
            setUserType('operator');
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
                    debug.notify("success", `Gebruiker aangemaakt: ${createdUser.email}`);

                    // Enkel automatisch inloggen bij registratiepagina
                    if (!isEditMode) {
                        try {
                            const responseData = await loginUser(email, password);
                            await login(responseData);
                        } catch  {
                            debug.notify("error", "Automatisch inloggen mislukt. Inloggen handmatig vereist.");
                            navigate("/login");
                            return;
                        }

                        // Redirect op basis van rol
                        navigate(userType === "beheerder" ? "/profile/edit" : "/JobOverview");
                    }
                }
            } catch (err) {
                debug.notify("error", parseApiError(err));
            }

            return;
        }


        // Bewerken bestaande gebruiker (admin met selectie)
        if (isEditMode && isAdmin && selectedUser) {
            const userData = userList.find(u => u.email === selectedUser);
            if (!userData || !userData.email) {
                debug.notify("error", "Gebruiker niet gevonden.");
                return;
            }

            const updates = {};
            if (password) updates.password = password;
            if (!userData.roles || userData.roles[0] !== userType) updates.roles = [userType];

            if (Object.keys(updates).length === 0) {
                debug.notify("info", "Geen wijzigingen om op te slaan.");
                return;
            }
            debug.notify("warning", "Functie niet geimplementeerd!");
        }
    };

    /**
     * Verwijder geselecteerde gebruiker (alleen beheerder)
     */
    const handleDelete = async () => {
        if (!selectedUser) return;

        const userData = userList.find(u => u.email === selectedUser);
        if (!userData || !userData.email) {
            debug.notify("error", "Gebruiker niet gevonden.");
            return;
        }



        try {
            const success = await deleteUser(userData.email, user.token);
            if (success) {
                debug.notify("success", `Gebruiker "${selectedUser}" is verwijderd.`);
                setUserList(prev => prev.filter(u => u.email !== userData.email));
                setSelectedUser('');
                setEmail('');
                setPassword('');
                setUserType('Operator');
            } else {
                debug.notify("error", "Verwijderen mislukt.");
            }
        } catch (err) {
            debug.notify("error", parseApiError(err));
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
                                disabled={!isAdmin}
                                options={[
                                    { value: "operator", label: "Operator" },
                                    { value: "beheerder", label: "Beheerder" },
                                    { value: "programmer", label: "Programmer" },
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
