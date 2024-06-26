import { useState } from "react";
import './navBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
// import { googleLogout } from '@react-oauth/google';
import { Link } from 'react-router-dom'

const Nav_bar = ({ creds }) => {
    const [sidePanel, setSidePanel] = useState(false)

    const logOut = () => {
        console.log('clicked logout')
        window.location.replace("https://bh-price-tracker.netlify.app/")
    };

    return (
        <>
            <div className='nav_Container'>
                <div className="cred_container">
                    <div id="totalCreds">{creds ? creds : "Loading-creds"}</div>
                    <FontAwesomeIcon icon={faStar} />
                </div>
                <div className='navBar'>
                    <ul className='nav_items'>
                        <li className='hover-underline-animation'>
                            <Link to="/">Home</Link>
                        </li>
                        <li className='hover-underline-animation'>
                            <Link to={{
                                pathname: '/TrackingPage'
                            }}>Tracker</Link>
                        </li>
                        <li onClick={logOut} className='hover-underline-animation'>
                            <Link to="/">LogOut</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='burger_Container'>
                <div className='burger'>
                    <button onClick={() => setSidePanel(true)}>
                        <hr></hr>
                        <hr></hr>
                        <hr></hr>
                    </button>
                </div>
                {
                    sidePanel &&
                    <div className='burger_navBar'>
                        <div className='sidePanelFlexContent'>
                            <div>
                                <button onClick={() => setSidePanel(false)} className='sideButtonClose'>
                                    X
                                </button>
                            </div>
                            <div className="cred_container">
                                <div id="totalCreds"> {creds ? creds : "Loading-creds"}</div>
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div>
                                <ul className='burger_nav_items'>
                                    <li className='hover-underline-animation'>
                                        <Link to="/" onClick={() => setSidePanel(false)}>Home</Link>
                                    </li>
                                    <li className='hover-underline-animation'>
                                        <Link to="/TrackingPage" onClick={() => setSidePanel(false)}>Tracker</Link>
                                    </li>
                                    <li className='hover-underline-animation'>
                                        <Link to="/" onClick={logOut}>LogOut</Link>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Nav_bar;