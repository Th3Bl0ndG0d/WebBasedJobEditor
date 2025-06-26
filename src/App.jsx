// import './App.css'
// import Navigation from "./components/navigation/Navigation.jsx";
// import NotFound from "./pages/notFound/NotFound.jsx";
// import Profile from "./pages/profile/Profile.jsx";
// import Login from "./pages/login/Login.jsx";
// import JobOverview from "./pages/jobOverview/JobOverview.jsx";
// import JobEditor from "./pages/jobcreator/JobCreator.jsx";
// import { Route, Routes } from "react-router-dom";
//
// function App() {
//     return (
//         <>
//             {/*            /!*<JobEditor/>*!/*/}
//             {/*             /!*<JobOverview/>*!/*/}
//             {/*             /!*<Profile mode="edit" />*!/*/}
//             {/*            /!*<Profile mode="register" />*!/*/}
//             {/*            /!*<NotFound/>*!/*/}
//             {/*/!*<Navigation/>*!/*/}
//             <Navigation />
//             <Routes>
//                 <Route path="/" element={<Login />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/JobOverview" element={<JobOverview />} />
//                 <Route path="/profile/edit" element={<Profile mode="edit" />} />  {/* Profiel bewerken route */}
//                 <Route path="/profile/register" element={<Profile mode="register" />} />
//                 <Route path="*" element={<NotFound />} />
//             </Routes>
//         </>
//     );
// }
//
// export default App;

// import './App.css';
// import Navigation from "./components/navigation/Navigation.jsx";
// import NotFound from "./pages/notFound/NotFound.jsx";
// import Profile from "./pages/profile/Profile.jsx";
// import Login from "./pages/login/Login.jsx";
// import JobOverview from "./pages/jobOverview/JobOverview.jsx";
// import JobEditor from "./pages/jobcreator/JobCreator.jsx";
// import { Route, Routes, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./helpers/AuthContext.jsx";
//
// function ProtectedRoute({ children, roles }) {
//     const { user } = useAuth();
//     if (!user) return <Navigate to="/login" />;
//     if (roles && !roles.includes(user.role)) return <Navigate to="/JobOverview" />;
//     return children;
// }
//
// function AppContent() {
//     const { user } = useAuth();
//
//     return (
//         <>
//             {user && <Navigation />}
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/JobOverview" element={<ProtectedRoute><JobOverview /></ProtectedRoute>} />
//                 <Route path="/job-editor" element={<ProtectedRoute><JobEditor /></ProtectedRoute>} />
//                 <Route path="/profile/edit" element={<ProtectedRoute roles={['Beheerder']}><Profile mode="edit" /></ProtectedRoute>} />
//                 <Route path="/profile/register" element={<ProtectedRoute roles={['Beheerder']}><Profile mode="register" /></ProtectedRoute>} />
//                 <Route path="/" element={<Navigate to={user ? "/JobOverview" : "/login"} />} />
//                 <Route path="*" element={<NotFound />} />
//             </Routes>
//         </>
//     );
// }
//
// function App() {
//     return (
//         <AuthProvider>
//             <AppContent />
//         </AuthProvider>
//     );
// }
//
// export default App;
import './App.css';
import Navigation from "./components/navigation/Navigation.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import JobOverview from "./pages/jobOverview/JobOverview.jsx";
import JobEditor from "./pages/jobcreator/JobCreator.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./helpers/AuthContext.jsx";
import {AuthProvider, useAuth} from "./helpers/AuthProvider.jsx";
import JobDetail from "./pages/jobdetails/JobDetails.jsx";
import JobCreator from "./pages/jobcreator/JobCreator.jsx";

// ProtectedRoute zorgt dat alleen ingelogde gebruikers toegang krijgen
function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();

    // Niet ingelogd → redirect naar login
    if (!user) return <Navigate to="/login" replace />;

    // Ingelogd, maar geen toegestane rol → redirect naar JobOverview
    if (roles && !roles.includes(user.role)) return <Navigate to="/JobOverview" replace />;

    return children;
}

// AppContent bevat alle routes en nav
function AppContent() {
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
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
