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
import customer from '../../../model/customer';
<<<<<<< HEAD
import { set } from '../../../model/cart';
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
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
<<<<<<< HEAD
    const setAuth = useContext(AuthContext);
=======
    const { token, customerId } = useContext(AuthContext);
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
    const { displayRazorpay } = PaymentGateway();
    const navigate = useNavigate();
    let queryForEvent;
    const closeModalHandler = () => {
        setInfo(false);
    }
    const bookAnEvent = (id) => {
        setEventId(id);
        // console.log(id, "eventId", token, customerId)
<<<<<<< HEAD
        if (setAuth.CustomerId === null || setAuth.Email === null) {
=======
        if (token === null || token === undefined) {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
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
<<<<<<< HEAD
                    addBooking(createBooking:{eventId:"${eventId}",customerId:"${setAuth.CustomerId}"}){
=======
                    addBooking(createBooking:{eventId:"${eventId}",customerId:"${customerId}"}){
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
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
<<<<<<< HEAD
                },
                credentials: 'include'
            }).then(response => {
                return response.json();
            }).then(data => {
                // console.log(data, "killer")
=======
                    'Authorization': "Bearer" + " " + token
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data, "killer")
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            })
        }

    }, [paymentId])

    const saveInCart = (val) => {
<<<<<<< HEAD
        if (setAuth.CustomerId === null && setAuth.Email === null) {
=======
        if (!token && !customerId) {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            navigate('/login');
            return;
        }
        // console.log("IN CART ",customerId,token,val)
        const queryForCart = {
            query: `
            mutation{
<<<<<<< HEAD
                cartEvent(cartInput:{eventId:"${val}",customerId:"${setAuth.CustomerId}"}){
=======
                cartEvent(cartInput:{eventId:"${val}",customerId:"${customerId}"}){
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
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
<<<<<<< HEAD
            },
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            // console.log(data, "cart")
=======
                'Authorization': "Bearer" + " " + token
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data, "cart")
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
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
        return <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "20px" }} key={i}>
<<<<<<< HEAD
            <div className="card text-center shadow" style={{ width: '700px', position: 'relative' }}>
=======
            <div className="card text-center shadow" style={{ width: '550px', position: 'relative' }}>
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
                {/* <i
            className="fa-regular fa-bookmark position-absolute top-0 end-0 m-2 text-danger"
            role="button"
            onClick={()=>saveInCart(val._id)}
            ></i> */}
                <div className="row g-0">
<<<<<<< HEAD
                    <div className="col-md-5 p-0">
                        
                            <img src={val.image || "https://via.placeholder.com/300x200.png?text=No+Image"}
                                className="img-fluid h-100 w-100"
                                style={{ objectFit: 'cover',maxHeight: '230px' }}
                                alt="Event Image" />

                    </div>
                    <div className="col-md-7">
                        <div className="card-body">
                            <h5 key={val._id} className="card-title">{val.title}</h5>
                            <p className="card-text text-muted small mb-2">{val.desc}</p>
                            <p className="fw-bold text-dark mb-3">₹ {val.price}</p>
=======
                    <div className="col-md-4">
                        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Event Image" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 key={val._id} className="card-title">{val.title}</h5>
                            <p className="card-text text-muted small mb-2">{val.desc}</p>
                            <p className="fw-bold text-dark mb-3">{val.price}</p>
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
                            <p className="card-text text-muted small mb-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />{val.address}, {val.city}, {val.state}
                            </p>
                            <p className="card-text text-muted small mb-2">
                                <FontAwesomeIcon icon={faTicketAlt} /> {new Date(Number(val.date)).toLocaleDateString()}
                            </p>

                            <div className="d-flex justify-content-between">
                                <button onClick={() => bookAnEvent(val._id)} value={val._id} className="btn btn-dark btn-sm">Book</button>
                                <button onClick={() => saveInCart(val._id)} className="btn btn-dark btn-sm">Add-to-cart</button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>




    })

    return (
        <>
            <div className="text-center my-4 px-3">
                <h3 className="fw-bold text-primary display-6">
                    {props.city ? `Events result in ${props.city}` : 'Our All Events'}
                </h3>
                <hr className="w-25 mx-auto border-primary" />
            </div>

<<<<<<< HEAD
            <li style={{ textAlign: "center", listStyleType: "none", marginBottom: "40px" }}>{event}</li>
=======
            <li style={{ textAlign: "center", listStyleType: "none", marginBottom:"40px"}}>{event}</li>
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280


        </>
    )
}
export default Eventitem;