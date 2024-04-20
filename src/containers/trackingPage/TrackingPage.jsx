
import { Fade } from "react-awesome-reveal";
import { Accordion, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faPenToSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import './trackingPage.css';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const apiCall_for_mongo = async (redirectParam, id, userData) => {

    // const myHeaders = new Headers();
    // myHeaders.append("x-api-key", );
    // myHeaders.append("Content-Type", "application/json");

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
        return JSON.parse(JSON.parse(result['body']))
    } catch (error) {
        console.error(error);
    }
};


const TrackingPage = ({ email_ID }) => {

    const [userData, set_userData] = useState(null)
    const [triggerPriceArray, set_triggerPriceArray] = useState([])
    const [triggerFreqArray, set_triggerFreqArray] = useState([])
    const location = useLocation();

    useEffect(() => {

        if (location.state !== null) {
            console.log(location.state)
            set_userData(location.state.document)
        }
        else {
            console.log(userData)
            console.log("enteres else")
            const userDetailsFetch = async (id) => {
                console.log(id)
                const data = await apiCall_for_mongo("user_check", email_ID, userData)

                set_triggerPriceArray(new Array(data.document.tracker_details.track_prices.length).fill(1))
                set_triggerFreqArray(new Array(data.document.tracker_details.track_prices.length).fill(1))
                set_userData(data.document)
            }
            userDetailsFetch(email_ID)
        }

    }, [email_ID, location.state])

    const priceEditClickHandler = (preferenceDivID) => {

        const newArray = [...triggerPriceArray]
        newArray[preferenceDivID] = 0
        set_triggerPriceArray(newArray)


        // document.getElementById("trigger_price_div" + preferenceDivID).innerHTML(`<input min="0" placeholder='Dream Price' type="number" className="form-control" />
        // `)

        // const updatedData = { ...userData };
        // updatedData.tracker_details.track_prices[preferenceDivID - 1] = 0;
        // set_userData(updatedData)

    }

    const frequencyEditClickHandler = (preferenceDivID) => {

        const newArray = [...triggerFreqArray]
        newArray[preferenceDivID] = 0
        set_triggerFreqArray(newArray)

    }

    const saveClickHandler = (preferenceDivID) => {

        // if (document.getElementById("dreamPrice" + preferenceDivID)
        //     || document.getElementById("frequency" + preferenceDivID)) {

        // const updatedData = JSON.parse(JSON.stringify(userData))
        const updatedData = { ...userData }

        updatedData.tracker_details.track_prices[preferenceDivID] = 100
        // parseFloat(document.getElementById("dreamPrice" + preferenceDivID).value);

        // document.getElementById("dreamPrice" + preferenceDivID).value == null ?
        //     updatedData.tracker_details.track_prices[preferenceDivID] :
        //     parseFloat(document.getElementById("dreamPrice" + preferenceDivID).value);
        console.log(userData)
        console.log(updatedData)

        set_userData({
            ...userData,
            name: "Peter"
        })
        //        }
    }


    return (
        <>
            {userData &&
                <div>
                    <Fade>
                        <div id="trackingPage">
                            <Accordion defaultActiveKey="0">
                                {
                                    userData.tracker_details.product_titles.map((product, index) => {
                                        return (<Accordion.Item eventKey={index} key={index}>
                                            <Accordion.Header>
                                                <div>
                                                    <div>
                                                        {product}
                                                    </div>
                                                    <br />
                                                    <div>
                                                        {userData.tracker_details.product_prices[index]}
                                                    </div>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div>
                                                    <div>
                                                        <div>
                                                            Product Name:
                                                            <a className="prod_Links" rel="noreferrer" target="_blank" href={userData.tracker_details.track_links[index]}>
                                                                {product}
                                                            </a>
                                                        </div>
                                                        <div>
                                                            Product Current Price: {userData.tracker_details.product_prices[index]}
                                                        </div>
                                                    </div>
                                                    <div id={"preference_div" + (index + 1)} className="user_set-profiles">
                                                        {
                                                            triggerPriceArray[index] ?

                                                                <div id={"trigger_price_div" + (index + 1)}>
                                                                    Trigger Price:
                                                                    {userData.tracker_details.track_prices[index]}
                                                                    <Button onClick={() => priceEditClickHandler(index)} variant="dark">
                                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                                    </Button>
                                                                </div>
                                                                :
                                                                <input id={"dreamPrice" + index} min="0" placeholder='Dream Price' type="number" className="form-control" />
                                                        }
                                                        {
                                                            triggerFreqArray[index] ?
                                                                <div>
                                                                    Trigger Frequency:
                                                                    {userData.tracker_details.track_freq[index]} mins
                                                                    <Button onClick={() => frequencyEditClickHandler(index)} variant="dark">
                                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                                    </Button>
                                                                </div>
                                                                :
                                                                <input id={"frequency" + index} min="5" type="number" placeholder='Check Frequency (mins)' className="form-control" />
                                                        }

                                                        <div>
                                                            Last Triggered:
                                                            {userData.tracker_details.last_triggeres[index] === "" ? " Not Triggered Yet" : userData.tracker_details.last_triggeres[index]}
                                                        </div>
                                                        <div>
                                                            <Button onClick={() => saveClickHandler(index)} variant="primary">
                                                                <FontAwesomeIcon icon={faSave} />
                                                            </Button>
                                                            <Button variant="danger">
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>)
                                    })
                                }
                            </Accordion>
                        </div>
                    </Fade>
                </div>
            }
        </>
    )
}

export default TrackingPage