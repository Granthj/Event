import { useState,useContext, useEffect} from "react";
import { AuthContext } from '../utils/authContext';
import { cancelBooking } from "../../graphql/resolver";
import ModalCancel from './ModalCancelBooking';

const YourBooking = ()=>{
    const { tokenData } = useContext(AuthContext);
    const [cancel,Cancelbooking] = useState(false);
    const [state,setState] = useState(false);
    const [newState,setNewState] = useState();
    const [boolState,setBoolState] = useState(false);
    const [bookingData,customerBookingData] = useState([]);
    const [bookingID,setBookingID] = useState();
    const [boolUpdate,setBoolUpdate] = useState(false);
    const [close,setClose] = useState(true);

    const cancelBooking = (Id)=>{
        Cancelbooking(true);
        setBookingID(Id);
        setClose(true);
    }
    const Close = ()=>{
        setClose(false);
    }
    let query={
        query:`
        query{
            singleBooking{
                _id
                event
                title
            }
        }
        `
    }
    const confirm = ()=>{
        console.log("HIII",bookingID)
        let queryDelete = {
            query: `
            mutation{
                cancelBooking(bookingId:"${bookingID}"){
                    _id
                }
            }
        `}
        fetch('http://localhost:7000/graphql',{
                method: "POST",
                body: JSON.stringify(queryDelete),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer" + " " + tokenData
                }
            }).then(response=>{
                return response.json();
                    
                }).then(data=>{
                    setBoolUpdate(true);
                    Cancelbooking(false);
                })
        }
        useEffect(()=>{
            if(tokenData){
                fetch('http://localhost:7000/graphql',{
                    method:'POST',
                    body:JSON.stringify(query),
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': "Bearer" + " " + tokenData
                    }
                }).then(response=>{
                    return response.json()
                }).then(data=>{
                    if(data){
                        setState(true);
                        customerBookingData(data.data.singleBooking);
                        setBoolState(true);
                        setBoolUpdate(false);
                    }
                })    
            }          
        },[boolUpdate])
            
            const CustomerBooking = bookingData.map((val)=>{
                console.log(val.title)
                return <div>
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{val.title}</h5>
                                <button type="button" class="btn btn-danger" onClick={()=>cancelBooking(val ._id)}>Cancel Booking</button>
                </div>
                </div>
                </div>
            })
    return(
        <>
        {cancel && <ModalCancel confirmCancel={confirm} closeCancel={Close} close={close}></ModalCancel>}
        {state?<li style={{textAlign:"center", listStyleType:"none"}}>{CustomerBooking}</li>
        :<h1>Sorry,No Booking...</h1>}
        </>
    )
}
export default YourBooking;
