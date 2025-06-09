import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/authContext';
import { Button, Modal } from 'react-bootstrap';
import PaymentGateway from './PaymentGateway';
import { PaymentContext } from '../utils/paymentId';
import { useEffect, useRef } from 'react';
const CartPage = () => {
    const { token, customerId } = useContext(AuthContext);
    const [cartData, setCartData] = useState([]);
    const [show, setShow] = useState(false);
    const [choosenData,setChoosenData] = useState();
    const [confirm,setConfirm] = useState(false);
    const {paymentId,setpaymentId} = useContext(PaymentContext);
    const {displayRazorpay} = PaymentGateway();
    const hasRunOnce = useRef(false);
    
    // console.log(displayRazorpay,"ABCD")
    // const [close, setClose] = useState(true);
    // console.log(token, customerId, "token and customerId");
    const handleClose = () => setShow(false);
    const handleConfirm = ()=>{
        displayRazorpay(choosenData.eventId);
        setShow(false);
    }
    const fetchCartData = ()=>{    
            const queryForCartData = {
                query:
                    `query {
                    getCart(customerId:"${customerId}") {
                        _id
                        title
                        price
                        desc
                        date
                        eventId
            }
        }`
            }
            fetch('http://localhost:7000/graphql', {
                method: "POST",
                body: JSON.stringify(queryForCartData),
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': "Bearer" + " " + token
                }
            }).then(response => {
                return response.json();
            }
            ).then(data => {
                if(data.data === null){
                    console.log("No cart data found");
                    return;
                }
                // console.log(data,"cart data")
                setCartData(data.data.getCart);
                
            })
        
        }
        useEffect(() => {
            fetchCartData();
        }, []);
        
        useEffect(()=>{
             if (!hasRunOnce.current) {
                hasRunOnce.current = true;
                return; // Skip the first run
            }
            console.log(paymentId,"PaymentIIIDDDD")
            if(paymentId){
            const queryForEvent = {
                query: `
                mutation{
                    addBooking(createBooking:{eventId:"${choosenData.eventId}",customerId:"${customerId}"}){
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
                }`
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
                // console.log(data,"killer")
            })
        }
        },[paymentId])
    const onBook = (item) => {
        setChoosenData(item);
        setShow(true);
    }
        const onRemove = (item) => {
            console.log(item.title,item._id,"remove")
            const queryForRemove = {
                query: `
                mutation{
                    cartEventDelete(cartCancelInput:{customerId:"${customerId}",cartId:"${item._id}"}){
                        _id
                        eventId
                    }
                }`
            }
            fetch('http://localhost:7000/graphql', {
                method: "POST",
                body: JSON.stringify(queryForRemove),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer" + " " + token
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                fetchCartData();
            })
        }
    

    const cartArr = cartData.map((item) => {

        return (

            <div key={item._id} className="card mb-4 w-100 shadow-sm" style={{ width: '100%' }}>
                <div className="row g-0">
                    {/* Image on the left - takes 4 columns on md screens and up, full width on smaller screens */}
                    <div className="col-md-4 p-3 d-flex align-items-center justify-content-center bg-light">
                        <img
                            src="https://cdn.pixabay.com/photo/2016/11/29/09/08/cart-1867780_1280.png"
                            alt={item.title}
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Content on the right - takes 8 columns on md screens and up */}
                    <div className="col-md-8">
                        <div className="card-body h-100 d-flex flex-column">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text text-muted">{item.desc}</p>

                            <div className="mt-auto">
                                <p className="card-text fs-5">
                                    <strong>Price:</strong> ${item.price}
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Date: {new Date(Number(item.date)).toLocaleDateString()}
                                    </small>
                                </p>
                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        className="btn btn-primary btn-sm px-3 py-0"
                                        onClick={() => onBook(item)}
                                    >
                                        Book Now
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm px-3 py-0"
                                        onClick={() => onRemove(item)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
    )

    return (
        <>
            <div className="container py-5">
                <h2 className="text-center mb-4">Your Cart</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {cartArr.length > 0 ? (
                            cartArr
                        ) : (
                            <div className="text-center py-5">
                                <img
                                    src="https://cdn.pixabay.com/photo/2016/11/22/23/44/porsche-1851246_1280.jpg"
                                    alt="Empty cart"
                                    className="img-fluid mb-3"
                                    style={{ maxHeight: '200px' }}
                                />
                                <h4 className="text-muted">Your cart is empty</h4>
                                <p className="text-muted">Start shopping to add items to your cart</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {show&&<Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{choosenData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body><strong>Date of the event: {new Date(Number(choosenData.date)).toLocaleDateString()}</strong></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>}
            
        </>
    );
}
export default CartPage;