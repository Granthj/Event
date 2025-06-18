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
    const citi = data?.location?.city;
    const state = data?.location?.state;
    console.log("EventsPage rendered", city,);
    const [events, setEvents] = useState([]);
    const [key, setKey] = useState(null);
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    useEffect(() => {
        if (citi !== city) {
            navigate('/');
        }
  }, [city]);
    const queryBody = citi
        ? {
            query: `
              query {
                eventsByLocation(city: "${citi}",state: "${data?.location?.state}") {
                  _id
                  title
                  price
                  desc
                  date
                  city
                  address
                  state
                  image
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
                  image
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
                    if (data.errors) {
                        setShow(true);
                        setTimeout(()=>{
                            setShow(false);
                            navigate('/')
                        }, 2000);
                        throw new Error(data.errors[0].message);
                    }
                    console.log()
                    if (citi) {
                        setEvents(data.data.eventsByLocation);
                        setKey(data.data.eventsByLocation);
                    }
                    else if (data.data !== null) {  
                        setEvents(data.data.event);
                        setKey(data.data.event);
                    }
                }).catch(err => {
                    setErrorMessage(err.message);
                    console.log(err, "error in events");
                })
        }
        fetchData();
    }, [citi])
    const onClose = ()=>{
        setShow(false);
    }
    return (
        <>  {!key ? <Shimmer></Shimmer> : <Eventitem events={events} city={citi}></Eventitem>}
            
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