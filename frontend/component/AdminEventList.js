import { useState } from "react";
import Modal from 'react-modal';

const AdminEventList = (props) => {
    // console.log(props.data,"tuio")
    const [modal,useModal] = useState(false);
    const [index,setIndex] = useState(0);
    const modalCloseHandler = ()=>{
        useModal(false);
    }
    const setStateHandler = (i)=>{
        console.log(i)
        setIndex(i);
        useModal(true);
    }
    const eventData = props.data.map((data,i) => {
        return (
            <>
            <div style={{width:"500px",height:"100px",border:"2px solid black",marginLeft:"700px",backgroundColor:"gray"}}>
              <button onClick={()=>setStateHandler(i)}>Customer who Booked</button>
                <p style={{textAlign:"center"}}>{data.title}</p>
                <p style={{textAlign:"center"}}>{data.date}</p>
              </div>
            </>
        )
    });
    const eventBooked = props.data[0].bookedBy.map(data=>{
            return (
                <li>{data.email}</li>
            )
    })
    return (
        <>
          <p>{eventData}</p>
          {modal&&<Modal isOpen={true} onRequestClose={modalCloseHandler}>
            <button onClick={modalCloseHandler}>Close</button>
            <ul>
                {eventBooked.length!==0?<li>{eventBooked}</li>:<li>No Booking</li>}
            </ul>
          </Modal>}

        </>
    )
}
export default AdminEventList;