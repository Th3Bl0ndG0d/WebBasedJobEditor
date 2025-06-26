// // import React, { useState } from 'react';
// // import './Login.css';
// // import Button from "../../components/button/Button.jsx";
// //
// // function Login() {
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //
// //     const handleLogin = (e) => {
// //         e.preventDefault();
// //         //Hier moet een API call komen
// //         alert(`Ingelogd met:\nEmail: ${email}\nWachtwoord: ${password}`);
// //     };
// //
// //     return (
// //         <div className="outer-container login-wrapper">
// //             <div className="inner-container login-form">
// //                 <form className="form-card login-form" onSubmit={handleLogin}>
// //                     <h1>Inloggen WBJE</h1>
// //
// //                     <label htmlFor="email">Emailadres</label>
// //                     <input className="input-standard"
// //                         type="email"
// //                         id="email"
// //                         placeholder="Vul je email in"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         required
// //                     />
// //
// //                     <label htmlFor="password">Wachtwoord</label>
// //                     <input className="input-standard"
// //                         type="password"
// //                         id="password"
// //                         placeholder="Vul je wachtwoord in"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         required
// //                     />
// //
// //                     <Button
// //                         type="submit"
// //                         label="Inloggen"
// //                     />
// //                     <p className="forgot-password">
// //                         <a href="#">Wachtwoord vergeten?</a>
// //                     </p>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // }
// //
// // export default Login;
// // Login.jsx
// import React, { useEffect, useState } from 'react';
// import './Login.css';
// import Button from "../../components/button/Button.jsx";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../helpers/AuthContext.jsx";
//
// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const { login } = useAuth();
//     const navigate = useNavigate();
//
//     // Voeg standaard admin toe bij eerste bezoek
//     useEffect(() => {
//         const users = JSON.parse(localStorage.getItem('users')) || [];
//         const adminBestaat = users.some(u => u.email === 'admin@example.com');
//
//         if (!adminBestaat) {
//             users.push({
//                 username: 'admin',
//                 email: 'admin@example.com',
//                 password: 'admin',
//                 role: 'Beheerder'
//             });
//             localStorage.setItem('users', JSON.stringify(users));
//         }
//     }, []);
//
//     const handleLogin = (e) => {
//         e.preventDefault();
//         setError('');
//
//         const users = JSON.parse(localStorage.getItem('users')) || [];
//         const foundUser = users.find(user => user.email === email);
//
//         if (!foundUser) {
//             setError('Geen gebruiker gevonden met dit e-mailadres.');
//             return;
//         }
//
//         if (foundUser.password !== password) {
//             setError('Wachtwoord komt niet overeen.');
//             return;
//         }
//
//         login(foundUser.role);
//         navigate("/JobOverview");
//     };
//
//     const handleRegisterRedirect = (e) => {
//         e.preventDefault();
//         navigate("/profile/edit?new=1");
//     };
//
//     return (
//         <div className="outer-container login-wrapper">
//             <div className="inner-container login-form">
//                 <form className="form-card login-form" onSubmit={handleLogin}>
//                     <h1>Inloggen WBJE</h1>
//
//                     <label htmlFor="email">Emailadres</label>
//                     <input className="input-standard"
//                            type="email"
//                            id="email"
//                            placeholder="Vul je email in"
//                            value={email}
//                            onChange={(e) => setEmail(e.target.value)}
//                            required
//                     />
//
//                     <label htmlFor="password">Wachtwoord</label>
//                     <input className="input-standard"
//                            type="password"
//                            id="password"
//                            placeholder="Vul je wachtwoord in"
//                            value={password}
//                            onChange={(e) => setPassword(e.target.value)}
//                            required
//                     />
//
//                     {error && <p className="error-message">{error}</p>}
//
//                     <Button type="submit" label="Inloggen" />
//
//                     <p className="forgot-password">
//                         <a href="#" onClick={handleRegisterRedirect}>Nieuwe gebruiker aanmaken</a>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// }
//
// export default Login;
// import React, { useEffect, useState } from 'react';
// import './Login.css';
// import Button from "../../components/button/Button.jsx";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../helpers/AuthContext.jsx";
// import { ensureDefaultUsersInStorage } from "../../helpers/defaultUsers.js";
//
// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const { login } = useAuth();
//     const navigate = useNavigate();
//
//     // Voeg standaardgebruikers toe bij eerste bezoek
//     useEffect(() => {
//         ensureDefaultUsersInStorage();
//     }, []);
//
//     const handleLogin = (e) => {
//         e.preventDefault();
//         setError('');
//
//         const users = JSON.parse(localStorage.getItem('users')) || [];
//         const foundUser = users.find(user => user.email === email);
//
//         if (!foundUser) {
//             setError('Geen gebruiker gevonden met dit e-mailadres.');
//             return;
//         }
//
//         if (foundUser.password !== password) {
//             setError('Wachtwoord komt niet overeen.');
//             return;
//         }
//
//         login(foundUser.role);
//         console.log(`Ingelogd als: ${foundUser.username} (${foundUser.role})`);
//
//         // Redirect op basis van rol
//         if (foundUser.role === 'Beheerder') {
//             navigate("/profile/edit");
//         } else {
//             navigate("/JobOverview");
//         }
//     };
//
//     return (
//         <div className="outer-container login-wrapper">
//             <div className="inner-container login-form">
//                 <form className="form-card login-form" onSubmit={handleLogin}>
//                     <h1>Inloggen WBJE</h1>
//
//                     <label htmlFor="email">Emailadres</label>
//                     <input
//                         className="input-standard"
//                         type="email"
//                         id="email"
//                         placeholder="Vul je email in"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//
//                     <label htmlFor="password">Wachtwoord</label>
//                     <input
//                         className="input-standard"
//                         type="password"
//                         id="password"
//                         placeholder="Vul je wachtwoord in"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//
//                     {error && <p className="error-message">{error}</p>}
//
//                     <Button type="submit" label="Inloggen" />
//
//                     <p className="forgot-password">
//                         <Link to="/profile/register">Nieuwe gebruiker aanmaken</Link>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// }
//
// export default Login;

import React, { useEffect, useState } from 'react';
import './Login.css';
import Button from "../../components/button/Button.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../helpers/AuthContext.jsx";
import { ensureDefaultUsersInStorage } from "../../helpers/defaultUsers.js";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Voeg standaardgebruikers toe bij eerste bezoek
    useEffect(() => {
        ensureDefaultUsersInStorage();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(user => user.email === email);

        if (!foundUser) {
            console.warn('❌ Geen gebruiker gevonden met e-mailadres:', email);
            setError('Geen gebruiker gevonden met dit e-mailadres.');
            return;
        }

        if (foundUser.password !== password) {
            console.warn('❌ Ongeldig wachtwoord voor:', email);
            setError('Wachtwoord komt niet overeen.');
            return;
        }

        // ✅ Volledige gebruiker doorgeven aan context
        login(foundUser);
        console.log(`✅ Ingelogd als: ${foundUser.username} (${foundUser.role})`);

        // Navigatie op basis van rol
        if (foundUser.role === 'Beheerder') {
            navigate("/profile/edit");
        } else {
            navigate("/JobOverview");
        }
    };

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
