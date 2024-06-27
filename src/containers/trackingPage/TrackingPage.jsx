
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

// const apiCall_for_mongo = async (redirectParam, id, data,index) => {

//     const myHeaders = new Headers();
//     myHeaders.append("x-api-key", process.env.REACT_APP_AWS_API_key);
//     myHeaders.append("Content-Type", "application/json");

// const raw = JSON.stringify({
//     "function_redirect": redirectParam,
//     "email_ID": id,
//     "user_data": data,
//     "index": index
// });

//     const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow"
//     };

//     try {
//         const response = await fetch("https://fzy7wm6u0e.execute-api.ap-south-1.amazonaws.com/dev/", requestOptions)
//         const result = await response.json();
//         return JSON.parse(JSON.parse(result['body']))
//     } catch (error) {
//         console.error(error);
//     }
// };

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
    // console.log("component rendered")

    // userInitialData = JSON.parse(JSON.parse(userInitialData.body))
    // userInitialData = userInitialData.document
    // const [userData, set_userData] = useState(userInitialData)

    const [triggerPriceArray, set_triggerPriceArray] =
        useState(new Array(userData.tracker_details.track_prices.length).fill(1))

    const [triggerFreqArray, set_triggerFreqArray] =
        useState(new Array(userData.tracker_details.track_prices.length).fill(1))

    const [indexState, setindexState] = useState({ indexChanged: null, key: 0 })

    useEffect(() => {

        const userDetailsFetch = async () => {
            var data = await apiCall_for_mongo("user_check", email_ID, null, null)
            console.log(data)
            data = JSON.parse(JSON.parse(data.body))
            set_userData(data.document)
        };
        userDetailsFetch();
    }, [])

    useEffect(() => {
        if (indexState.key) {
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

        setindexState(produce(draft => {
            draft.indexChanged = preferenceDivID;
            draft.key += 1;
        }));

        //API call mongo for save



    }

    const deleteClickHandler = (preferenceDivID) => {

        set_userData(
            produce(userData, (draft) => {

                for (const ele in draft.tracker_details) {
                    draft.tracker_details[ele].splice(preferenceDivID, 1);
                }

            })
        );

        setindexState(produce(draft => {
            draft.indexChanged = preferenceDivID;
            draft.key += 1;
        }));

        //API call mongo for delete
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
                                                                Track Till:
                                                                {
                                                                    formatDateString(userData.tracker_details.track_till[index])
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
            }
        </>
    )
}

export default TrackingPage