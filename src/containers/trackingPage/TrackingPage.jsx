
import { Fade } from "react-awesome-reveal";
import { Accordion, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faPenToSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import './trackingPage.css';
import { useEffect, useState } from "react";

import { parseISO, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { produce } from 'immer';
import { useLocation } from 'react-router-dom';


const formatDateString = (isoString) => {

    // Parse the ISO string into a Date object
    const date = parseISO(isoString);

    // Define a function to get the ordinal suffix
    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };

    // Format the date parts
    const day = format(date, 'd');
    const month = format(date, 'MMMM');
    const year = format(date, 'yyyy');
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = formatInTimeZone(date, localTimezone, 'h:mm a')

    // Construct the formatted date string with the ordinal suffix
    return `${day}${getOrdinalSuffix(day)} ${month} ${year} ${time}`;
};

const TrackingPage = ({ apiCall_for_mongo, email_ID, userData, set_userData }) => {
    console.log(email_ID)
    console.log(userData)

    const userDetailsFetch = async () => {
        console.log("userdatafetch")
        var data = await apiCall_for_mongo("user_check", email_ID, null, null)
        console.log(data)
        data = JSON.parse(JSON.parse(data.body))
        set_userData(data.document)
    };


    const [triggerPriceArray, set_triggerPriceArray] = useState([])

    const [triggerFreqArray, set_triggerFreqArray] = useState([])

    const [indexState, setindexState] = useState({
        indexChanged: null,
        clickedParam: null,
        key: 0
    })

    useEffect(() => {
        if (!(userData === null)) {
            set_triggerPriceArray([new Array(userData.tracker_details.track_prices.length).fill(1)])
            set_triggerFreqArray([new Array(userData.tracker_details.track_prices.length).fill(1)])
        }
        else {
            userDetailsFetch();
        }
        console.log("usereffect triggered")
    }, [])

    useEffect(() => {
        console.log(indexState)
        if (indexState.key) {
            if (indexState.clickedParam === "delete") {
                const delete_product_data = () => {
                    apiCall_for_mongo("tracker_data_delete", email_ID, userData, indexState.indexChanged)
                };
                delete_product_data();
            }
            else {
                const edit_product_data = () => {
                    apiCall_for_mongo("tracker_data_edit", email_ID, userData, indexState.indexChanged)
                };
                edit_product_data();
            }
            console.log("api triggered for index " + indexState.indexChanged)
        }
    }, [indexState])

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
                var tillDateEle = document.getElementById("tracktill" + preferenceDivID)

                if (priceEle) {
                    priceEditClickHandler(preferenceDivID)

                    if (priceEle.value) { draft.tracker_details.track_prices[preferenceDivID] = parseFloat(priceEle.value) }
                }

                if (freqEle) {
                    frequencyEditClickHandler(preferenceDivID)

                    if (freqEle.value) { draft.tracker_details.track_freq[preferenceDivID] = parseFloat(freqEle.value) }
                }

                if (tillDateEle) {
                    if (tillDateEle.value) {
                        // Get the user's UTC offset in minutes
                        const offsetMinutes = new Date().getTimezoneOffset();

                        // Convert the offset to hours and minutes
                        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
                        const offsetMins = Math.abs(offsetMinutes) % 60;
                        const offsetSign = offsetMinutes > 0 ? "-" : "+";
                        const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

                        draft.tracker_details.track_till[preferenceDivID] = tillDateEle.value + ":00.000" + offsetString
                    }
                }

                setindexState(produce(draft => {
                    draft.indexChanged = preferenceDivID;
                    draft.clickedParam = "save"
                    draft.key += 1;
                }));

            })
        )

    }

    const deleteClickHandler = (preferenceDivID) => {

        set_userData(
            produce(userData, (draft) => {

                for (const ele in draft.tracker_details) {
                    draft.tracker_details[ele].splice(preferenceDivID, 1);
                }

                setindexState(produce(draft => {
                    draft.indexChanged = preferenceDivID;
                    draft.key += 1;
                    draft.clickedParam = "delete"
                }));
            })
        );
    }

    return (
        <>
            {!(userData === null) && userData.tracker_details.track_prices.length ?
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
                                                                {
                                                                    (triggerFreqArray[index] && triggerPriceArray[index]) ?
                                                                        <div>
                                                                            Track Till:
                                                                            {
                                                                                userData.tracker_details.track_till[index] ? formatDateString(userData.tracker_details.track_till[index]) : "NA"
                                                                            }
                                                                        </div>
                                                                        :
                                                                        <input id={"tracktill" + index} type="datetime-local" placeholder='Check till (Date Time)' className="form-control" />
                                                                }
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
                :
                <div className="initial-noData_Display">
                    Please add Trackers to display here
                </div>
            }
        </>
    )
}

export default TrackingPage