import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import JobOverview from "./pages/jobOverview/JobOverview.jsx";

function App() {
  return (
    <>
        <Login/>
        <Profile mode="edit" />
        <Profile mode="register" />

        <NotFound/>

        <Navigation/>



        <JobOverview/>


    </>
  )
}

export default App
