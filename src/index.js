import React from "react";
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthContainer } from "./containers";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './index.css'


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider
            clientId="251216354307-qetlgl2cqnu11oodgutklsmq0ii5o6d2.apps.googleusercontent.com">
            <GoogleAuthContainer />
        </GoogleOAuthProvider>
    </React.StrictMode>
)

