
import { Fade } from "react-awesome-reveal";
import axios from "axios";
import { Accordion, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faPenToSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import './trackingPage.css';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TrackingPage = ({ usermail }) => {

    let data = JSON.stringify({
        "collection": "tracker-details",
        "database": "amz-traker",
        "dataSource": "Cluster-amz",
        "filter": {
            "name": "Akshay Kumar"
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-xumjr/endpoint/data/v1/action/findOne',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'N5f2484Za5b7J6fauLiL35lDOAHDHinm8PtzSgBQsTCoN99ZYG83KayZJjtFVCev'
        },
        data: data
    };

    axios.get(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
















    // const url = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/covid-19-qppza/service/REST-API/incoming_webhook/metadata';
    // const [countries, setCountries] = useState([]);

    // useEffect(() => {
    //     axios.get(url).then(res => {
    //         setCountries(res.data.countries);
    //     })
    // }, [])

    // console.log(countries)







    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Access-Control-Request-Headers", "*");
    // myHeaders.append("api-key", "N5f2484Za5b7J6fauLiL35lDOAHDHinm8PtzSgBQsTCoN99ZYG83KayZJjtFVCev");

    // const raw = JSON.stringify({
    //     "collection": "tracker-details",
    //     "database": "amz-traker",
    //     "dataSource": "Cluster-amz",
    //     "filter": {
    //         "name": "Akshay Kumar"
    //     }
    // });

    // const requestOptions = {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: "follow"
    // };

    // fetch("https://ap-south-1.aws.data.mongodb-api.com/app/data-xumjr/endpoint/data/v1/action/findOne", requestOptions)
    //     .then((response) => response.text())
    //     .then((result) => console.log(result))
    //     .catch((error) => console.error(error));






    const location = useLocation();
    // console.log("usermail : " + usermail)
    // eslint-disable-next-line
    const [userData, set_userData] = useState(require('../../assets/userData.json'))
    console.log(userData)
    var newEntry = JSON.parse(JSON.stringify(userData))

    if (location.state !== null) {
        newEntry.tracker_details.product_titles.push(location.state.data[0][0])
        newEntry.tracker_details.product_prices.push(location.state.data[0][2])
        // newEntry.tracker_details.tracker_details.track_links.push("")
        newEntry.tracker_details.track_prices.push(0.00)
        newEntry.tracker_details.track_freq.push(1)
        newEntry.tracker_details.last_triggeres.push("00:00 AM 0st April 0000");
    }

    useEffect((newEntry) => {

        set_userData(newEntry)

    }, [])

    //const user_ID = usermail.replace("@gmail.com", "");

    return (
        <>
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
                                                <div className="user_set-profiles">
                                                    <div>
                                                        Trigger Price:
                                                        {userData.tracker_details.track_prices[index]}
                                                        <Button variant="dark">
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        Trigger Frequency:
                                                        {userData.tracker_details.track_freq[index]} mins
                                                        <Button variant="dark">
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        Last Triggered:
                                                        {userData.tracker_details.last_triggeres[index]}
                                                    </div>
                                                    <div>
                                                        <Button variant="primary">
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
        </>
    )
}

export default TrackingPage