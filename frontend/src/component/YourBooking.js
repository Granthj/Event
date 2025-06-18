import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../utils/authContext';
import ModalCancel from './ModalCancelBooking';
import '../css/yourBookings.css';

const YourBooking = () => {
    const setAuth = useContext(AuthContext);
    const [cancel, Cancelbooking] = useState(false);
    const [state, setState] = useState(false);
    const [newState, setNewState] = useState();
    const [boolState, setBoolState] = useState(false);
    const [bookingData, customerBookingData] = useState([]);
    const [bookingID, setBookingID] = useState();
    const [boolUpdate, setBoolUpdate] = useState(false);
    const [close, setClose] = useState(true);

    const cancelBooking = (Id) => {
        Cancelbooking(true);
        setBookingID(Id);
        setClose(true);
    }
    const Close = () => {
        setClose(false);
    }
    let query = {
        query: `
        query{
           customerBooking(customerId:"${setAuth.CustomerId}"){
            _id
            title
            price
            desc
            date
            image
            city
            state
            address
            bookingId
            createdAt
           }
        }
        `
    }
    const confirm = () => {
        let queryDelete = {
            query: `
            mutation{
                cancelBooking(bookingId:"${bookingID}"){
                    _id
                }
            }
        `}
        fetch('http://localhost:7000/graphql', {
            method: "POST",
            body: JSON.stringify(queryDelete),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(response => {
            return response.json();

        }).then(data => {
            setBoolUpdate(true);
            Cancelbooking(false);
        })
    }
    useEffect(() => {
        if (setAuth.CustomerId && setAuth.Email) {
            fetch('http://localhost:7000/graphql', {
                method: 'POST',
                body: JSON.stringify(query),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }).then(response => {
                return response.json()
            }).then(data => {
                if (data) {
                    setState(true);
                    customerBookingData(data.data.customerBooking);
                    setBoolState(true);
                    setBoolUpdate(false);
                }
            })
        }
    }, [boolUpdate])
    const CustomerBooking = bookingData.map((val) => (
        <div key={val._id} className="d-flex justify-content-center">
            <div className="card mb-4 shadow-sm" style={{ width: '550px' }}>
                <div className="row g-0">
                    {/* Image on the left - takes 4 columns on md screens and up, full width on smaller screens */}
                    <div className="col-md-6 p-3 d-flex align-items-center justify-content-center bg-light">
                        <img
                            src={val.image || "https://cdn.pixabay.com/photo/2016/11/29/09/08/cart-1867780_1280.png"}
                            alt={val.title}
                            className="img-fluid h-100 w-100"
                            style={{  minHeight: '200px' }}
                        />
                    </div>

                    {/* Content on the right - takes 8 columns on md screens and up */}
                    <div className="col-md-5">
                        <div className="card-body h-100 d-flex flex-column ps-0">
                            <h5 className="card-title">{val.title}</h5>
                            <p className="card-text text-muted">{val.desc}</p>

                            <div className="mt-auto">
                                <p className="card-text fs-5">
                                    <strong>₹</strong> {val.price}
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Date of event: {new Date(Number(val.date)).toLocaleDateString()}
                                    </small>
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Date of booking: {new Date(Number(val.createdAt)).toLocaleDateString()}
                                    </small>
                                </p>
                                <p className="card-text text-muted small mb-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {val.address.charAt(0).toUpperCase() + val.address.slice(1).toLowerCase()}, {''}
                                    {val.city.charAt(0).toUpperCase() + val.city.slice(1).toLowerCase()},
                                    {val.state.charAt(0).toUpperCase() + val.state.slice(1).toLowerCase()}
                                </p>
                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        className="btn btn-outline-dark btn-sm px-3 py-0"
                                        onClick={() => cancelBooking(val.bookingId)}
                                    >
                                        Cancel Booking
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    ));

    return (
        <>
            {/* {state ? <li style={{ textAlign: "center", listStyleType: "none" }}>{CustomerBooking}</li>
                : <h1>Sorry,No Booking...</h1>} */}


            <div className="container py-5">
                {cancel && <ModalCancel confirmCancel={confirm} closeCancel={Close} show={close}></ModalCancel>}
                <h2 className="text-center mb-4">Your Bookings</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {CustomerBooking.length > 0 ? (
                            CustomerBooking
                        ) : (
                            <div className="text-center py-5">
                                <img
                                    src="https://cdn.pixabay.com/photo/2016/11/22/23/44/porsche-1851246_1280.jpg"
                                    alt="Empty cart"
                                    className="img-fluid mb-3"
                                    style={{ maxHeight: '200px' }}
                                />
                                <h4 className="text-muted">No Bookings</h4>
                                <p className="text-muted">Go event and book your event!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}
export default YourBooking;
