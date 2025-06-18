import React, { useEffect, useState } from "react";
const Modal = (props)=>{
    return(
        <>
        <div style={{width:"300px",padding:"10px",margin:"10px 700px",border:"2px solid black"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Events</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.closeModal} style={{backgroundColor:"red"}}></button>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal" onClick={props.closeModal} style={{marginTop:"25px", marginRight:"10px"}}>Close</button>
                    <button type="button" className="btn btn-outline-success" onClick={props.confirm} style={{marginTop:"25px"}}>Save changes</button>
                </div>
                </div>
            </div>
        </div>
    </>
    )
}
export default Modal;