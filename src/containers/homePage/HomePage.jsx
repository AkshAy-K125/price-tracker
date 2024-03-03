
import './homePage.css'
import { Fade } from "react-awesome-reveal";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
// import productDetailsFetch from '../../backendCode/lambda_call'

const HomePage = ({ username }) => {

    const navigate = useNavigate();
    const navigateToTracker = (result) => {
        navigate("/TrackingPage", { state: result });
    }

    const details = () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "url": [
                document.getElementById('trackerURL').value
            ],
            "dream_price": [
                document.getElementById('trackerPrice').value
            ],
            "freq": [
                document.getElementById('tackerFreq').value
            ]
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://ry3tu30fnf.execute-api.ap-south-1.amazonaws.com/default/test", requestOptions)
            .then(response => response.json())
            .then((result) => {

                console.log("Product: " + result.data[0][0]
                    + "\nPrice: " + result.data[0][1] + " " + result.data[0][2])

                navigateToTracker(result);

            })
            .catch(error => console.log('error', error));
    }


    return (
        <><div>
            <Fade>
                <div className="home_container">
                    <h3>
                        Hi, {username}
                    </h3>
                    <input id='trackerURL' placeholder='Tracker Link' type="text" className="form-control" />
                    <input id='trackerPrice' type="number" className="form-control" />
                    <input id='tackerFreq' type="number" className="form-control" />
                    <Button variant="outline-primary" onClick={() => details()}>Track</Button>
                    <div className="adBlock">
                    </div>
                </div>
            </Fade >
        </div >
        </>
    )
}

export default HomePage