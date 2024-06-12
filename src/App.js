
import { HomePage, NavBar, TrackingPage } from './containers';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = ({ auth }) => {
    const user_data = jwtDecode(auth.credential)
    const [creds, setCreds] = useState(null)

    // const user_data = {
    //     given_name: "newUSer",
    //     email: "newUser@gmail.com"
    // }

    const apiCall_for_mongo = async (redirectParam, id, userData) => {

        const raw = JSON.stringify({
            "function_redirect": redirectParam,
            "email_ID": id,
            "user_data": userData
        });


        const requestOptions = {
            method: "POST",
            headers: {
                'x-api-key': process.env.REACT_APP_AWS_API_key,
                'Content-Type': 'application/json'
            },
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://fzy7wm6u0e.execute-api.ap-south-1.amazonaws.com/dev/", requestOptions)
            const result = await response.json();
            return (result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const userDetailsFetch = async (id) => {
            const data = await apiCall_for_mongo("user_check", user_data.email, null)
            setCreds(JSON.parse(JSON.parse(data.body))["document"]["creds"])
        };

        userDetailsFetch();

    })










    return (
        <>
            <Router>
                <NavBar creds={creds} />
                <Routes>
                    <Route path="/" element={<HomePage username={user_data.given_name} email_ID={user_data.email} />} />
                    <Route path="/TrackingPage" element={<TrackingPage email_ID={user_data.email} />} />
                </Routes>
            </Router>
        </>
    )
}

export default App