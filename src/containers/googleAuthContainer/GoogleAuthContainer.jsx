
import { GoogleLogin } from '@react-oauth/google';
import './googleAuthContainer.css'
import App from './../../App'
import { useState } from 'react';


const GoogleAuthContainer = () => {

    const [auth, setAuth] = useState(null)

    return (
        <>
            {auth ?
                <App auth={auth} />
                :
                <div className='authBlock'>
                    <div>
                        Hi, please sign-up/sign-in using google to continue
                    </div>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            setAuth(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}

                        auto_select
                    />
                    <div>

                    </div>
                </div>

            }
        </>
    )
}

export default GoogleAuthContainer