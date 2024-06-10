import { useState } from "react";
const EventModal = (props) => {
    const [state,setState] = useState();
    const [info, setInfo] = useState(true);
    const [id,setId] = useState(props.ids);
    const cancelHandler = ()=>{
        if(info === true){
            setInfo(false);
        }
        else if(info === false){
            setInfo(true);
        }

    }
    // console.log(props.value.title,"kjvhdiuf")
    return (
        <div >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    {<h1>{props.value[props.index].title}</h1>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
         </div>
    )
}
export default EventModal;