
import { HomePage, NavBar, TrackingPage } from './containers';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = ({ auth }) => {
    const user_data = jwtDecode(auth.credential)

    const [creds, setCreds] = useState(null)
    const [userInitialData, setuserInitialData] = useState(null)

    // const user_data = {
    //     given_name: "newUSer",
    //     email: "newUser@gmail.com"
    // }

    const apiCall_for_mongo = async (redirectParam, id, userData, index) => {

        const raw = JSON.stringify({
            "function_redirect": redirectParam,
            "email_ID": id,
            "user_data": userData,
            "index": index
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
            var data = await apiCall_for_mongo("user_check", user_data.email, null, null)

            data = JSON.parse(JSON.parse(data))
            console.log(data)
            console.log(data.statusCode)

            if (data.statusCode === 404) {
                setCreds(100)
            }
            else {
                setuserInitialData(data.body.document)
                setCreds(data["document"]["creds"])
            }
        };

        userDetailsFetch();

    }, [user_data.email])


    return (
        <>
            <Router>
                <NavBar creds={creds} />
                <Routes>
                    <Route path="/" element={<HomePage setUserData={setuserInitialData} setCreds={setCreds} username={user_data.given_name} email_ID={user_data.email} />} />
                    <Route path="/TrackingPage" element={<TrackingPage apiCall_for_mongo={apiCall_for_mongo} set_userData={setuserInitialData} userData={userInitialData} email_ID={user_data.email} />} />
                </Routes>
            </Router>
        </>
    )
}

export default App