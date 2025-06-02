import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from '../utils/authContext';
import Eventitem from './Eventitem';
import Shimmer from './shimmer';
import Search from './Search';
const EventsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const { city } = useParams();
    console.log("EventsPage rendered", data?.location?.state, city);
    const [events, setEvents] = useState([]);
    const [key, setKey] = useState(null);
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { token, customerId } = useContext(AuthContext);
    const queryBody = city
        ? {
            query: `
              query {
                eventsByLocation(city: "${city}",state: "${data?.location?.state}") {
                  _id
                  title
                  price
                  desc
                  date
                  city
                  address
                  state
                }
              }
            `,
        }
        : {
            query: `
              query {
                event {
                  _id
                  title
                  price
                  desc
                  date
                  city
                  address
                  state
                  bookedBy {
                    email
                  }
                }
              }
            `,
        };
    useEffect(() => {
        function fetchData() {
            fetch('http://localhost:7000/graphql', {
                method: "POST",
                body: JSON.stringify(queryBody),
                headers: {
                    'Content-Type': 'application/json',

                }
            })
                .then(response => {
                    // if(response.status !== 200 && response.status !== 201) throw new Error('Failed');
                    return response.json();
                }).then(data => {
                    console.log(data, "data from events");
                    if (data.data === null) {
                        setShow(true);
                        setTimeout(()=>{
                            setShow(false);
                            navigate('/')
                        }, 2000);
                        throw new Error(data.errors[0].message);
                    }
                    if (city) {
                        setEvents(data.data.eventsByLocation);
                        setKey(data.data.eventsByLocation);
                    }
                    else if (data.data !== null) {
                        // console.log(token,"tokenFROMEVENTS")
                        // console.log(data.data.event, "ok Error")
                        setEvents(data.data.event);
                        setKey(data.data.event);
                    }
                }).catch(err => {
                    setErrorMessage(err.message);
                    console.log(err, "error in events");
                })
        }
        fetchData();
    }, [city])
    const onClose = ()=>{
        setShow(false);
    }
    return (
        <>  {!key ? <Shimmer></Shimmer> : <Eventitem events={events}></Eventitem>}
            
                {<Modal show={show} onHide={onClose} centered>
                    <Modal.Header closeButton style={{ backgroundColor: "#4CAF50", color: "white" }}>
                        <Modal.Title>Fail!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{errorMessage}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={onClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>}
            
        </>
    )
}
export default EventsPage;