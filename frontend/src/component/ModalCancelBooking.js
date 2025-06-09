import { useEffect, useState ,useContext} from "react";
import '../css/cancelModal.css';

const ModalCancelBooking = (props)=>{
    // console.log("I am  Here")
    // const [close,setClose] = useState(true);
    // const closeCancel = ()=>{
    //     setClose(false);
    // }
    if (!props.show) return null;
    return(
        <>
           (
  <div 
    className="modal-backdrop" 
    tabIndex="-1" 
    onClick={props.closeCancel} // Close modal when clicking outside
  >
    <div 
      className="modal-container" 
      onClick={(e) => e.stopPropagation()} // Prevent click propagation inside modal
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Are you sure you want to cancel?</h5>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-dark" 
              onClick={props.closeCancel}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-dark"  // Changed to red for "danger" action
              onClick={props.confirmCancel}
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)
        
        </>
    )
}
export default ModalCancelBooking;