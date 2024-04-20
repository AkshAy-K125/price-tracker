import React from "react";
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthContainer } from "./containers";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './index.css'
import App from "./App";


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <App />
    // <GoogleOAuthProvider
    //     clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID} >
    //     <GoogleAuthContainer />
    // </GoogleOAuthProvider>
)

