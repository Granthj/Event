import { useEffect, useState ,useContext} from "react";

const ModalCancelBooking = (props)=>{
    // console.log("I am  Here")
    // const [close,setClose] = useState(true);
    // const closeCancel = ()=>{
    //     setClose(false);
    // }
    return(
        <>
            {props.close && <div  tabindex="-1" style={{width:"300px",padding:"10px",margin:"10px 700px",border:"2px solid black"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Are You want To Cancel?</h5>
    
                </div>
                <div className="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={props.closeCancel}>Close</button>
                        <button type="button" class="btn btn-primary" onClick={props.confirmCancel}>Confirm</button>
                </div>
                </div>
            </div>
        </div>}
        
        </>
    )
}
export default ModalCancelBooking;