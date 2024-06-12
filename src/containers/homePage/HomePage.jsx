
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './homePage.css'
import { Fade } from "react-awesome-reveal";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DNA } from 'react-loader-spinner'
import { useState } from 'react';


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
        const response = await fetch("https://8nxfchxw8k.execute-api.ap-south-1.amazonaws.com/dev/", requestOptions)
        const result = await response.json();
        return (result);
    } catch (error) {
        console.error(error);
    }
};



const HomePage = ({ username, email_ID }) => {

    const navigate = useNavigate();
    const [siteListClicked, setSiteListClicked] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(false);

    const setSiteListClickedHandle = () => {
        setSiteListClicked(!siteListClicked)
    }


    const navigateToTracker = (result) => {
        navigate("/TrackingPage", { state: result });
    }

    async function userDetailsFetch() {
        setIsDataLoading(true);

        var productData = await apiCall_For_Scrapper(
            {
                "url": document.getElementById('trackerURL').value,
                "tracker_price": document.getElementById('trackerPrice').value,
                "frequency": document.getElementById('tackerFreq').value
            }
        )
        productData = productData["data"]

        const data = await apiCall_for_mongo("user_check", email_ID, productData)

        try {
            var jsonData = data;

            if (data.statusCode === 404) {
                jsonData = JSON.parse(JSON.parse(jsonData['body']))
                console.log("adding New User")

                var newUserData = {
                    "document": {
                        "name": username,
                        "email_ID": email_ID,
                        "tracker_details": {
                            "product_titles": [productData["title"]],
                            "product_prices": [parseFloat(productData["whole_price"])],
                            "track_links": [productData["track_link"]],
                            "track_prices": [parseFloat(productData["track_price"])],
                            "track_freq": [parseInt(productData["track_freq"], 10)],
                            "last_triggeres": [productData["last_trigger"]]
                        },
                        "creds": 100.00
                    }
                }

                console.log(newUserData)

                apiCall_for_mongo("set_new_user", email_ID, newUserData)

                setIsDataLoading(false);

                navigateToTracker(newUserData)
            }
            else {
                console.log("in else")
                jsonData = JSON.parse(JSON.parse(jsonData['body']))

                jsonData["document"]["tracker_details"]["last_triggeres"].push(productData["last_trigger"])
                jsonData["document"]["tracker_details"]["product_prices"].push(parseFloat(productData["whole_price"]))
                jsonData["document"]["tracker_details"]["product_titles"].push(productData["title"])
                jsonData["document"]["tracker_details"]["track_freq"].push(parseInt(productData["track_freq"], 10))
                jsonData["document"]["tracker_details"]["track_links"].push(productData["track_link"])
                jsonData["document"]["tracker_details"]["track_prices"].push(parseFloat(productData["track_price"]))

                console.log(jsonData)

                apiCall_for_mongo("existing_user_update", email_ID, jsonData["document"])

                setIsDataLoading(false);

                navigateToTracker(jsonData)
            }
        }
        catch (e) {
            console.log("entered catch")
            console.log(jsonData)
            console.log(e)

            setIsDataLoading(false);
        }
    }

    return (
        <>
            <div>
                <Fade>
                    <div className="home_container">
                        <h3>
                            Hi, {username}
                        </h3>
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
                        <div className="adBlock">
                        </div>
                    </div>
                </Fade >
            </div >
        </>
    )
}

export default HomePage