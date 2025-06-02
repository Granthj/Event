import { useContext, useEffect, useState } from 'react';
// import { FaTicketAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import EventInfo from './EventInfo';
import EventModal from './EventModal';
import Modal from 'react-modal';
import PaymentGateway from './PaymentGateway';
import { AuthContext } from '../utils/authContext';
import { PaymentContext } from '../utils/paymentId';
import customer from '../../model/customer';
const { useNavigate } = require('react-router-dom');
const Eventitem = (props) => {
    const [id, setId] = useState(null);
    const [Index, setIndex] = useState();
    const [eventId, setEventId] = useState();
    const [saveCustomerID, setsaveCustomerID] = useState(null);
    const [info, setInfo] = useState(false);
    const [book, paymentBook] = useState(false);
    const [eventBooked, setEventBooked] = useState();
    const { paymentId, setpaymentId } = useContext(PaymentContext);
    const { token, customerId } = useContext(AuthContext);
    const { displayRazorpay } = PaymentGateway();
    const navigate = useNavigate();
    let queryForEvent;
    const closeModalHandler = () => {
        setInfo(false);
    }
    const bookAnEvent = (id) => {
        setEventId(id);
        console.log(id, "eventId", token, customerId)
        if (token === null || token === undefined) {
            navigate('/login')
            // alert("Please login to book an event");
        }
        else {
            displayRazorpay(id);
        }
    }
    useEffect(() => {
        if (paymentId) {
            queryForEvent = {
                query: `
                mutation{
                    addBooking(createBooking:{eventId:"${eventId}",customerId:"${customerId}"}){
                        _id
                        createdAt
                        
                        event{
                            _id
                        }
                        customer{
                            _id
                        }
                        bookedBy{
                            email
                        }
                    }
                }
                `
            }
            fetch('http://localhost:7000/graphql', {
                method: "POST",
                body: JSON.stringify(queryForEvent),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer" + " " + token
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data, "killer")
            })
        }

    }, [paymentId])

    const saveInCart = (val) => {
        if(!token && !customerId){
            navigate('/login');
            return;
        }
        const queryForCart = {
            query: `
            mutation{
                cartEvent(cartInput:{eventId:"${val}",customerId:"${customerId}"}){
                    _id
                    eventId
                    customerId
                    title
                    price
                    desc
                    date
                }
            }   `
        }
        fetch('http://localhost:7000/graphql', {
            method: "POST",
            body: JSON.stringify(queryForCart),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer" + " " + token
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data, "cart")
        }).catch(e => {
            throw new Error(e);
        })
    }
    const moreInfoHandler = (Id, i) => {
        setIndex(i);
        if (id !== Id) {
            setInfo(true);
            setId(Id);
        }
        else {
            setId(id);
            if (info === true) {
                setInfo(false);
            }
            else if (info === false) {
                setInfo(true);
            }
        }
    }

    const event = props.events.map((val, i) => {
        return <div className="d-flex justify-content-center align-items-center" style={{marginTop:"20px"}} key={i}>
        <div className="card text-center shadow" style={{ width: '550px', position: 'relative' }}>
            {/* <i
            className="fa-regular fa-bookmark position-absolute top-0 end-0 m-2 text-danger"
            role="button"
            onClick={()=>saveInCart(val._id)}
            ></i> */}
          <div className="row g-0">
            <div className="col-md-4">
              <img src="https://via.placeholder.com/150" className="card-img-top" alt="Event Image"/>
            </div> 
            <div className="col-md-8">
              <div className="card-body">
                <h5 key={val._id} className="card-title">{val.title}</h5>
                <p className="card-text text-muted small mb-2">{val.desc}</p>
                <p  className="fw-bold text-primary mb-3">{val.price}</p>
                <p className="card-text text-muted small mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />{val.address}, {val.city}, {val.state}
                </p>
                <p className="card-text text-muted small mb-2">
                  <FontAwesomeIcon icon={faTicketAlt} /> {val.date}
                </p>

                <div className="d-flex justify-content-between">
                  <button onClick={()=>bookAnEvent(val._id)} value={val._id} className="btn btn-success btn-sm">Book</button>
                  <button onClick={()=>saveInCart(val._id)}  className="btn btn-success btn-sm">Add-to-cart</button>
                </div>

                
              </div>
            </div>
          </div>
         </div>
       </div>




    })

    return (
        <>
            <li style={{ textAlign: "center", listStyleType: "none" }}>{event}</li>
          

        </>
    )
}
export default Eventitem;