import './App.css';
import Navigation from "./components/navigation/Navigation.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import JobOverview from "./pages/jobOverview/JobOverview.jsx";
import JobEditor from "./pages/jobcreator/JobCreator.jsx";
import JobDetail from "./pages/jobdetails/JobDetails.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthContext} from "./context/AuthProvider.jsx";
import {useContext} from "react";
import isTokenValid from "./helpers/isTokenValid.js";

// ProtectedRoute zorgt dat alleen ingelogde gebruikers toegang krijgen
function ProtectedRoute({ children }) {
    const { isAuth, logout } = useContext(AuthContext); // Haal logout op uit context

    // Stap 1: Controleer of token geldig is (exp is nog niet verstreken)
    const tokenIsValid = isTokenValid();

    // Stap 2: Als gebruiker wel ingelogd is, maar token is verlopen → forceer logout met reden
    if (isAuth && !tokenIsValid) {
        logout("Session timed out");
        return <Navigate to="/login" replace />;
    }

    // Stap 3: Als gebruiker helemaal niet ingelogd is → redirect zonder melding
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }


    // Stap 4: Alles in orde → geef toegang tot beveiligde component
    return children;
}

// App bevat alle routes en nav
function App() {
    const { user } = useContext(AuthContext);

    return (
        <>
            {/* Navigatiebalk alleen zichtbaar als ingelogd */}
            {user && <Navigation />}

            <Routes>
                {/* Loginpagina altijd toegankelijk */}
                <Route path="/login" element={<Login />} />

                {/* Nieuw JobDetail route */}
                <Route path="/job/:jobId" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />

                {/* JobOverview alleen voor ingelogde gebruikers */}
                <Route path="/JobOverview" element={<ProtectedRoute><JobOverview /></ProtectedRoute>} />

                {/* JobEditor alleen voor ingelogde gebruikers */}
                <Route path="/JobCreator" element={<ProtectedRoute><JobEditor /></ProtectedRoute>} />

                {/* Profiel bewerken alleen voor ingelogde users. */}
                <Route path="/profile/edit" element={<ProtectedRoute><Profile mode="edit" /></ProtectedRoute>} />

                {/*Registratiepagina: openbaar toegankelijk */}
                <Route path="/profile/register" element={<Profile mode="register" />} />

                {/* Root route → redirect afhankelijk van loginstatus */}
                <Route path="/" element={<Navigate to={user ? "/JobOverview" : "/login"} replace />} />

                {/* Fallback voor niet-bestaande routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Toast meldingen */}
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default App;
