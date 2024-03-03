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
            clientId="290967390629-u66mf3mnv5mf4jdl4jo76pi5r798oub4.apps.googleusercontent.com">
            <GoogleAuthContainer />
        </GoogleOAuthProvider>
    </React.StrictMode>
)

