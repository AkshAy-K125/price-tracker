
import { HomePage, NavBar, TrackingPage } from './containers';
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = ({ auth }) => {
    // const user_data = jwtDecode(auth.credential)

    const user_data = {
        given_name: "newUSer",
        email: "newUser@gmail.com"
    }

    return (
        <>

            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage username={user_data.given_name} email_ID={user_data.email} />} />
                    <Route path="/TrackingPage" element={<TrackingPage email_ID={user_data.email} />} />
                </Routes>
            </Router>
        </>
    )
}

export default App