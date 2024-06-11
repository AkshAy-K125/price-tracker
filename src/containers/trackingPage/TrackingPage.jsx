
import { Fade } from "react-awesome-reveal";
import { Accordion, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faPenToSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import './trackingPage.css';
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { produce } from 'immer';

const apiCall_for_mongo = async (redirectParam, id, data) => {

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", process.env.REACT_APP_AWS_API_key);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "function_redirect": redirectParam,
        "email_ID": id,
        "user_data": data
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
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
    const loadCount = useRef(0)
    const initialLoad = useRef(0)
    const location = useLocation();

    useEffect(() => {

        if (location.state !== null) {
            set_triggerPriceArray(new Array(location.state.document.tracker_details.track_prices.length).fill(1))
            set_triggerFreqArray(new Array(location.state.document.tracker_details.track_prices.length).fill(1))
            set_userData(location.state.document)
            initialLoad.current = initialLoad.current + 1
        }
        else {
            const userDetailsFetch = async (id) => {
                const data = await apiCall_for_mongo("user_check", id, userData)

                set_triggerPriceArray(new Array(data.document.tracker_details.track_prices.length).fill(1))
                set_triggerFreqArray(new Array(data.document.tracker_details.track_prices.length).fill(1))
                set_userData(data.document)
                initialLoad.current = initialLoad.current + 1
            }
            userDetailsFetch(email_ID)
        }

    }, [email_ID, location.state])

    useEffect(() => {
        if (userData && initialLoad.current === 1) {
            if (loadCount.current) {
                apiCall_for_mongo("existing_user_update", email_ID, userData)

            }
            loadCount.current = loadCount.current + 1
        }

    }, [userData])

    const priceEditClickHandler = (preferenceDivID) => {

        const newArray = [...triggerPriceArray]
        newArray[preferenceDivID] = !newArray[preferenceDivID]
        set_triggerPriceArray(newArray)
    }

    const frequencyEditClickHandler = (preferenceDivID) => {

        const newArray = [...triggerFreqArray]
        newArray[preferenceDivID] = !newArray[preferenceDivID]
        set_triggerFreqArray(newArray)

    }

    const saveClickHandler = (preferenceDivID) => {

        set_userData(
            produce(userData, (draft) => {
                var priceEle = document.getElementById("dreamPrice" + preferenceDivID)
                var freqEle = document.getElementById("frequency" + preferenceDivID)

                if (priceEle) {

                    priceEditClickHandler(preferenceDivID)

                    if (priceEle.value) { draft.tracker_details.track_prices[preferenceDivID] = parseFloat(priceEle.value) }
                }

                if (freqEle) {

                    frequencyEditClickHandler(preferenceDivID)

                    if (freqEle.value) { draft.tracker_details.track_freq[preferenceDivID] = parseFloat(freqEle.value) }
                }


            })
        )
    }

    const deleteClickHandler = (preferenceDivID) => {

        set_userData(
            produce(userData, (draft) => {

                for (const ele in draft.tracker_details) {
                    draft.tracker_details[ele].splice(preferenceDivID, 1);
                }

            })
        );
    }


    return (
        <>
            {userData &&
                <div className="trackContainer">
                    <Fade>
                        <div id="trackingPage">
                            <Accordion defaultActiveKey="0">
                                {
                                    userData.tracker_details.product_titles.map((product, index) => {
                                        return (
                                            <Accordion.Item eventKey={index} key={index}>
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
                                                                <Button onClick={() => deleteClickHandler(index)} variant="danger">
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
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