// import './App.css'
// import Navigation from "./components/navigation/Navigation.jsx";
// import NotFound from "./pages/notFound/NotFound.jsx";
// import Profile from "./pages/profile/Profile.jsx";
// import Login from "./pages/login/Login.jsx";
// import JobOverview from "./pages/jobOverview/JobOverview.jsx";
// import JobEditor from "./pages/jobcreator/JobCreator.jsx";
// import {Route, Routes} from "react-router-dom";
//
// function App() {
//   return (
//     <>
//         <Routes>
//             {/*<Login/>*/}
//             {/*<JobEditor/>*/}
//             {/*<JobOverview/>*/}
//             {/*<Profile mode="edit" />*/}
//             {/*<Profile mode="register" />*/}
//
//             {/*<NotFound/>*/}
//
//             {/*<Navigation/>*/}
//
//             <Route path="/" element={<JobOverview />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/job-editor" element={<JobEditor />} />
//             <Route path="/profile/edit" element={<Profile mode="edit" />} />
//             <Route path="/profile/register" element={<Profile mode="register" />} />
//             <Route path="*" element={<NotFound />} />
//         <Footer />
//
//
//
//
//     </>
//   )
// }


import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import JobOverview from "./pages/jobOverview/JobOverview.jsx";
import JobEditor from "./pages/jobcreator/JobCreator.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            {/*            /!*<JobEditor/>*!/*/}
            {/*             /!*<JobOverview/>*!/*/}
            {/*             /!*<Profile mode="edit" />*!/*/}
            {/*            /!*<Profile mode="register" />*!/*/}
            {/*            /!*<NotFound/>*!/*/}
            {/*/!*<Navigation/>*!/*/}
            <Navigation />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/JobOverview" element={<JobOverview />} />
                <Route path="/profile/edit" element={<Profile mode="edit" />} />  {/* Profiel bewerken route */}
                <Route path="/profile/register" element={<Profile mode="register" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;