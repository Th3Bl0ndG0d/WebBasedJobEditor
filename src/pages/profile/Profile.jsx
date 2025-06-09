import React, { useState } from 'react';
import './Profile.css';

function Profile() {
    // State voor de invulbare velden
    const [username, setUsername] = useState('janedoe');
    const [email, setEmail] = useState('janedoe@example.com');
    const [userType, setUserType] = useState('Operator');

    const handleSave = () => {
        //Hier moet een API call komen
        alert(`Gegevend die uiteindelijk opgeslagen worden.\n\nGebruikersnaam: ${username}\nEmail: ${email}\nType gebruiker: ${userType}`);
    };

    return (
        <div>
            <h1 className="profile-title">Profielpagina</h1>

            <section className="profile-section">
                <h2>Gegevens</h2>
                <label>
                    Gebruikersnaam:<br />
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Email:<br />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>
            </section>

            <section className="profile-section">
                <h2>Kies je gebruikers-type</h2>
                <select value={userType} onChange={e => setUserType(e.target.value)}>
                    <option>Operator</option>
                    <option>Beheerder</option>
                    <option>Programmer</option>
                </select>
                <p>Gekozen type: <strong>{userType}</strong></p>
            </section>

            <button onClick={handleSave} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                Save
            </button>
        </div>
    );
}

export default Profile;

// import React, { useState } from 'react';
// import './Profile.css';  // zorg dat het pad klopt!
//
// function Profile() {
//     const [userType, setUserType] = useState('Operator');
//
//     return (
//         <div>
//             <h1 className="profile-title">Profielpagina</h1>
//
//             <section className="profile-section">
//                 <h2>Gegevens</h2>
//                 <p><strong>Gebruikersnaam:</strong> janedoe</p>
//                 <p><strong>Email:</strong> janedoe@example.com</p>
//             </section>
//
//             <section className="profile-section">
//                 <h2>Kies je gebruikers-type</h2>
//                 <select value={userType} onChange={e => setUserType(e.target.value)}>
//                     <option>Operator</option>
//                     <option>Beheerder</option>
//                     <option>Programmer</option>
//                 </select>
//                 <p>Gekozen type: <strong>{userType}</strong></p>
//             </section>
//         </div>
//     );
// }
//
// export default Profile;