import {useState} from 'react';
const EventInfo = (props)=>{
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
    return(
        <>
            {info&&id===props.value._id&&<h1>{props.value.title}</h1>}
            {/* {<button className='btn btn-primary' onClick={cancelHandler}>hide</button>} */}
        </>

    )
}
export default EventInfo;