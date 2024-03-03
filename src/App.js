
import { HomePage, NavBar, TrackingPage } from './containers';
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = ({ auth }) => {
    const user_data = jwtDecode(auth.credential)

    return (
        <>

            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage username={user_data.given_name} />} />
                    <Route path="/TrackingPage" element={<TrackingPage usermail={user_data.email} />} />
                </Routes>
            </Router>
        </>
    )
}

export default App