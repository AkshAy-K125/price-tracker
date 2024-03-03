
import { Fade } from "react-awesome-reveal";

import { Accordion, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'font-awesome/css/font-awesome.min.css';
import { faPenToSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons'

import './NewTracker.css'

const NewTracker = ({ userData }) => {
    var userData = {
        "user_details": {
            "name": "Akshay Kumar",
            "email_ID": "akshay.raviraj@gmail.com"
        },
        "tracker_details": {
            "product_titles": [
                "Prod1",
            ],
            "product_prices": [
                22.656,
            ],
            "track_links": [
                "https://www.amazon.in/boAt-Rockerz-255-Pro-Earphones/dp/B08TV2P1N8/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.e08c6279-844d-49c6-8e7c-3fcd4b905908&pd_rd_r=c0ff59dd-08c6-45c3-b81c-5d6cce1a7021&pd_rd_w=rHqIf&pd_rd_wg=abIuR&pf_rd_p=e08c6279-844d-49c6-8e7c-3fcd4b905908&pf_rd_r=04KJPZBAWQSB1HP84Z11&qid=1706616178&sr=8-1",
            ],
            "track_prices": [
                20.589,
            ],
            "track_freq": [
                5,
            ],
            "last_triggeres": [
                " 12:00 PM 5th June 2023",
            ]
        }
    }
    return (
        <>
            <div>
                <Fade>
                    <div id="trackingPage">
                        <Accordion defaultActiveKey="0">
                            {
                                userData.tracker_details.product_titles.map((product, index) => {
                                    return (<Accordion.Item eventKey={index}>
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

export default NewTracker