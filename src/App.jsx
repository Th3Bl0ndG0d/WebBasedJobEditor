import './App.css';
import Navigation from "./components/navigation/Navigation.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import JobOverview from "./pages/jobOverview/JobOverview.jsx";
import JobEditor from "./pages/jobcreator/JobCreator.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import {useAuth} from "./context/AuthProvider.jsx";
import JobDetail from "./pages/jobdetails/JobDetails.jsx";


// ProtectedRoute zorgt dat alleen ingelogde gebruikers toegang krijgen
function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();

    // Niet ingelogd → redirect naar login
    if (!user) return <Navigate to="/login" replace />;

    // Ingelogd, maar geen toegestane rol → redirect naar JobOverview
    if (roles && !roles.includes(user.role)) return <Navigate to="/JobOverview" replace />;

    return children;
}

// App bevat alle routes en nav
function App() {
    const { user } = useAuth();

    return (
        <>
            {/* Navigatiebalk alleen zichtbaar als ingelogd */}
            {user && <Navigation />}

            <Routes>
                {/* Loginpagina altijd toegankelijk */}
                <Route path="/login" element={<Login />} />

                {/* Nieuw JobDetail route */}
                <Route
                    path="/job/:jobId"
                    element={
                        <ProtectedRoute>
                            <JobDetail />
                        </ProtectedRoute>
                    }
                />

                {/* JobOverview alleen voor ingelogde gebruikers */}
                <Route
                    path="/JobOverview"
                    element={
                        <ProtectedRoute>
                            <JobOverview />
                        </ProtectedRoute>
                    }
                />

                {/* JobEditor alleen voor ingelogde gebruikers */}
                <Route
                    path="/JobCreator"
                    element={
                        <ProtectedRoute>
                            <JobEditor />
                        </ProtectedRoute>
                    }
                />

                {/* Profiel bewerken alleen voor ingelogde users. */}
                <Route
                    path="/profile/edit"
                    element={
                        <ProtectedRoute>
                            <Profile mode="edit" />
                        </ProtectedRoute>
                    }
                />


                {/*Registratiepagina: openbaar toegankelijk */}
                <Route
                    path="/profile/register"
                    element={<Profile mode="register" />}
                />

                {/* Root route → redirect afhankelijk van loginstatus */}
                <Route
                    path="/"
                    element={<Navigate to={user ? "/JobOverview" : "/login"} replace />}
                />

                {/* Fallback voor niet-bestaande routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

// Hoofdfunctie met AuthProvider
// Na de laatste les wat duidelijker, ipv alle gegoogl.
// Dit moet je op het hoogste niveau zetten.
//
// function App() {
//     return (
//         <AuthProvider>
//             <AppContent />
//         </AuthProvider>
//     );
// }
//
 export default App;
