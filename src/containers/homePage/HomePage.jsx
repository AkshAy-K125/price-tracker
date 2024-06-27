import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './homePage.css';
import { Fade } from "react-awesome-reveal";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DNA } from 'react-loader-spinner';
import { useState } from 'react';
import { Modaldialogue } from "./../../components"

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
        const response = await fetch("https://fzy7wm6u0e.execute-api.ap-south-1.amazonaws.com/dev/", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
};

const apiCall_For_Scrapper = async (productInfo) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(productInfo);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://8nxfchxw8k.execute-api.ap-south-1.amazonaws.com/dev/", requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
};

const HomePage = ({ username, email_ID, setCreds, setUserData }) => {

    const navigate = useNavigate();
    const [siteListClicked, setSiteListClicked] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    const setSiteListClickedHandle = () => {
        setSiteListClicked(!siteListClicked);
    };

    const navigateToTracker = (result) => {
        navigate("/TrackingPage", { state: result });
    };

    async function userDetailsFetch() {
        setIsDataLoading(true);

        const trackTimeTill = document.getElementById('trackTill').value

        // Get the user's UTC offset in minutes
        const offsetMinutes = new Date().getTimezoneOffset();

        // Convert the offset to hours and minutes
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes > 0 ? "-" : "+";
        const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

        const productData = await apiCall_For_Scrapper({
            "url": document.getElementById('trackerURL').value,
            "tracker_price": document.getElementById('trackerPrice').value,
            "frequency": document.getElementById('tackerFreq').value,
            "till": trackTimeTill + ":00.000" + offsetString
        });

        const data = await apiCall_for_mongo("user_check", email_ID, productData["data"], null);
        console.log(data)

        try {
            let jsonData = data;

            if (data.statusCode === 404) {
                jsonData = JSON.parse(JSON.parse(jsonData['body']));
                console.log("adding New User");

                const newUserData = {
                    "document": {
                        "name": username,
                        "email_ID": email_ID,
                        "tracker_details": {
                            "product_titles": [productData["data"]["title"]],
                            "product_prices": [parseFloat(productData["data"]["whole_price"])],
                            "track_links": [productData["data"]["track_link"]],
                            "track_prices": [parseFloat(productData["data"]["track_price"])],
                            "track_freq": [parseInt(productData["data"]["track_freq"], 10)],
                            "track_till": [productData["data"]["track_till"]],
                            "last_triggeres": [productData["data"]["last_trigger"]]
                        },
                        "creds": 100.00
                    }
                };

                apiCall_for_mongo("set_new_user", email_ID, newUserData);
                setIsDataLoading(false);
                navigateToTracker(newUserData);

            } else {
                console.log(jsonData['body'])
                jsonData = JSON.parse(JSON.parse(jsonData['body']));

                // Termination check point post Cred Check

                const startDate = new Date();
                const endDate = new Date(trackTimeTill);
                const differenceInMilliseconds = endDate - startDate;
                const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

                const freq = document.getElementById('tackerFreq').value

                if (parseInt(differenceInMinutes / parseInt(freq, 10), 10) > jsonData["document"]["creds"]) {
                    setCreds(jsonData["document"]["creds"])
                    setIsDataLoading(false);
                    setModalShow(true)

                    return
                }

                // Terminationcheck point post Cred Check ends here

                jsonData["document"]["tracker_details"]["last_triggeres"].push(productData["data"]["last_trigger"]);
                jsonData["document"]["tracker_details"]["product_prices"].push(parseFloat(productData["data"]["whole_price"]));
                jsonData["document"]["tracker_details"]["product_titles"].push(productData["data"]["title"]);
                jsonData["document"]["tracker_details"]["track_freq"].push(parseInt(productData["data"]["track_freq"], 10));
                jsonData["document"]["tracker_details"]["track_links"].push(productData["data"]["track_link"]);
                jsonData["document"]["tracker_details"]["track_prices"].push(parseFloat(productData["data"]["track_price"]));
                jsonData["document"]["tracker_details"]["track_till"].push(productData["data"]["track_till"]);

                var index = jsonData["document"]["tracker_details"]["track_prices"].length - 1;


                setCreds(jsonData["document"]["creds"]);

                // apicallsignature is --> apiCall_for_mongo(redirect_Param, email_ID,user_data,index)

                console.log("data sent to api mongo is")
                console.log(jsonData["document"])

                apiCall_for_mongo("existing_user_update",
                    email_ID,
                    jsonData["document"],
                    index);

                setIsDataLoading(false);
                navigateToTracker(jsonData);
            }
        } catch (e) {
            console.log(e);
            setIsDataLoading(false);
        }
    }

    return (
        <>{modalShow ?
            <Modaldialogue setModalShow={setModalShow} />
            :
            <div>
                <Fade>
                    <div className="home_container">
                        <h3>Hi, {username}</h3>
                        <div className='info_container'>
                            <div>Supported Websites
                                <button onClick={setSiteListClickedHandle} className='sitesInfoButton'>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button>
                            </div>
                            {siteListClicked &&
                                <div className='custom_modal'>
                                    <div className='custom_modal-content'>
                                        <p>Bahrain Greetings</p>
                                        <p>Dukakeen</p>
                                        <p>Live Well</p>
                                        <p>Lulu Hypermarket</p>
                                        <p>Namshi</p>
                                        <p>Next Direct</p>
                                        <p>Ootlah</p>
                                        <p>Ounass</p>
                                        <p>SharafDG</p>
                                    </div>
                                </div>}
                        </div>
                        <input id='trackerURL' placeholder='Product Link' type="text" className="form-control" />
                        <input id='trackerPrice' min="0" placeholder='Dream Price' type="number" className="form-control" />
                        <input id='tackerFreq' min="5" type="number" placeholder='Check Frequency (mins)' className="form-control" />
                        <input id='trackTill' type="datetime-local" placeholder='Check till (Date Time)' className="form-control" />
                        {isDataLoading ? <DNA
                            visible={true}
                            height="20vh"
                            width="15vw"
                            ariaLabel="dna-loading"
                            wrapperStyle={{}}
                            wrapperClass="dna-wrapper"
                        /> :
                            <Button variant="outline-primary" onClick={() => userDetailsFetch()}>Track</Button>
                        }
                        <div className="adBlock"></div>
                    </div>
                </Fade>
            </div>
        }
        </>
    );
};

export default HomePage;
