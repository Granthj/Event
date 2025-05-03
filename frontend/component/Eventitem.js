import { useContext, useEffect, useState } from 'react';
import EventInfo from './EventInfo';
import EventModal from './EventModal';
import Modal from 'react-modal';
import PaymentGateway from './PaymentGateway';
import { AuthContext } from '../utils/authContext';
import { PaymentContext } from '../utils/paymentId';
const Eventitem = (props)=>{
    const [id,setId] = useState(false);
    const [Index,setIndex] = useState();
    const [eventId,setEventId] = useState();
    const [saveCustomerID,setsaveCustomerID] = useState(null);
    const [info, setInfo] = useState(false);
    const [book,paymentBook] = useState(false);
    const [eventBooked,setEventBooked] = useState();
    const {paymentId,setpaymentId} = useContext(PaymentContext);
    const { token,customerId } = useContext(AuthContext);
    // const [variable,setVariable] = useState(true);
    // console.log(paymentId,"PaymentID")
    let queryForEvent;
    const closeModalHandler = ()=>{
        setInfo(false);
    }
    const bookAnEvent = (id)=>{
        setEventId(id);
        const queryForCustomer = {
            query:`
            query{
                customerBookedAnEvent{
                    _id
                }
            }   `
        }   
        fetch('http://localhost:7000/graphql', {
        method: "POST",
        body: JSON.stringify(queryForCustomer),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer" + " " + token
        }
    }).then(response => {
        // if(response.status !== 200 && response.status !== 201) throw new Error('Failed');
        return response.json();
    }).then(data=>{
        // let customerId = data.data.customerBookedAnEvent._id;
        // let customerIdString = customerId.toString();
        setsaveCustomerID(data.data.customerBookedAnEvent._id);
        setEventBooked(id);
        paymentBook(true);
        // console.log(customerIdString,"aisa");
    }).catch(e=>{
        throw new Error(e);
    });      
}
    useEffect(()=>{
        if(paymentId){
            queryForEvent = {
                query:`
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
            }).then(data=>{
                console.log(data,"killer")
            })
        }

    },[paymentId])
    
    
    const moreInfoHandler = (Id,i) => {
        setIndex(i);
        // if(variable === true && id == Id) {
        //     setVariable(false);
        // }
        // else{
        //     setVariable(true);
        // }
        if(id !== Id){
            setInfo(true);
            setId(Id);
        }
        else{
            setId(id);
            if(info === true){
                setInfo(false);
            }
            else if(info === false){
                setInfo(true);
            }
        }
    }
    const customStyles = {
        content:{
            marginLeft:"600px",
            width:"400px",
            backgroundColor: 'rgba(255, 255, 147, 0.75)',
            border:blur,
            boxShadow: "5px 10px #888888"
        }
    }
    
    const event = props.events.map((val,i) => {
        return <div style={{width:"600px",margin:"10px 520px", backgroundColor:"wheat",height:"auto"}}>
            <div style={{ border: "2px solid black", textAlign: "center" , borderRadius:"5px"}}>
                <ul style={{ listStyleType: "none" }}>
                    <li key={val._id} style={{textAlign:"center",color:"blue",margin:"10px 20px 10px -20px" }}>{val.title}</li>
                    <button onClick={()=>moreInfoHandler(val._id,i)} className="btn btn-outline-info btn-sm" style={{marginRight:"30px", marginTop:"20px"}} value={val._id}>Details</button>
                    <button onClick={()=>bookAnEvent(val._id)} className="btn btn-outline-info btn-sm" style={{marginRight:"30px", marginTop:"20px"}} value={val._id}>Book</button>
                </ul>
            <br></br>
            {/* {info&&val._id === id&&<EventInfo value={val} ids={id}></EventInfo>} */}
        {/* {setInfo(false)} */}
        </div>
        </div>
    })
    
    return (
        <>
        <li  style={{textAlign:"center", listStyleType:"none"}}>{event}</li>
        {book && <PaymentGateway event={eventBooked}></PaymentGateway>}
        {info&&id===props.events[Index]._id&&<Modal isOpen={true} style={customStyles}>
                <h1 style={{textAlign:"center"}}>{props.events[Index].title}</h1>
                <h3 style={{textAlign:"center", textDecoration:"underline", marginTop:"40px"}}>About Creator</h3>
                {/* {/* <h1 style={{textAlign:"center",marginTop:"20px"}}>{props.events[Index]..email}</h1> */}
                <h6 style={{textAlign:"center",marginTop:"20px"}}>{props.events[Index].bookedBy[0].email}</h6>
                <div>
                    <button className="btn btn-outline-dark btn-danger" style={{marginTop:"400px",marginLeft:"300px"}} onClick={closeModalHandler}>Close</button>
                </div>
            </Modal>}
        </>
    )
}
export default Eventitem;