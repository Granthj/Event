import { json } from 'body-parser';
import { useContext, useEffect, useState } from 'react';
import Modal from './Modals';
import { AuthContext } from '../utils/authContext';
import EventInfo from './EventInfo';
import Eventitem from './Eventitem';
import Shimmer from './shimmer';
const EventsPage = () => {
    const [state, setState] = useState(false);
    const [title, setTitle] = useState();
    const [price, setPrice] = useState();
    const [desc, setDesc] = useState();
    const [date, setDate] = useState();
    const [events, setEvents] = useState([]);
    const [Index, setIndex] = useState();
    const [choose, chooseState] = useState(null);
    const [key, setKey] = useState(null);
    const { tokenData } = useContext(AuthContext);

    function setModalHandler() {
        setState(true);
    }
    function closeHandler() {
        setState(false);
    }
 

    // const valueConfirmHandler = (e) => {
    //     e.preventDefault();
    //     let event = { title, price, date, desc };
    //     setState(true);
    //     const requestBody = {
    //         query: `
    //         mutation{
    //             createEvent(eventInput:{title:"${title}",price:${price},desc:"${desc}",date:"${date}"}){
    //                 title
    //                 price
    //                 desc
    //                 date
    //                 bookedBy
    //             }
    //         }
    //         `
    //     }
        // fetch('http://localhost:7000/graphql', {
        //     method: "POST",
        //     body: JSON.stringify(requestBody),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': "Bearer" + " " + tokenData
        //     }
        // }).then(response => {
        //     // if (response.status !== 200 && response.status !== 201) throw new Error('Failed');
        //     return response.json();
        // }).then(data => {
        //     // console.log("HELLOL", data);
        // })
    // }
    const eventReqBody = {
        query: `
        query{
            event{
                _id
                title
                price
                desc
                date
                bookedBy{
                    email
                }
            }    
        }
        `
    }
    useEffect(() => {
        function fetchData() {
            fetch('http://localhost:7000/graphql', {
                method: "POST",
                body: JSON.stringify(eventReqBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer" + " " + tokenData
                }
            })
                .then(response => {
                    // if(response.status !== 200 && response.status !== 201) throw new Error('Failed');
                    return response.json();
                }).then(data => {
                    if (data.data !== null) {
                        console.log(data.data.event,"ok Error")
                        setEvents(data.data.event);
                        chooseState(data);
                        setKey(data.data.event);
                    }
                })
        }
        fetchData();
    }, [])
    // console.log(key,"jhzsgdf")
    return (
        <>
            {/* {tokenData && state && <Modal close closeModal={closeHandler} confirm={valueConfirmHandler}>
                <form >
                    <label htmlFor='title'>Title</label>
                    <input className="form-control" type="text" onChange={(e) => { setTitle(e.target.value)}}></input>
                    <br></br>
                    <label htmlFor='price'>Price</label>
                    <input className="form-control" type="number" onChange={(e) => setPrice(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='date'>Date</label>
                    <input className="form-control" type="datetime-local" onChange={(e) => setDate(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='description'>Description</label>
                    <textarea className="form-control" type="text" onChange={(e) => setDesc(e.target.value)}></textarea>
                </form>
            </Modal>}
            {tokenData && <button className='btn btn-primary' onClick={setModalHandler}>Create Event</button>}
            <br></br> */}
            {!key?<Shimmer></Shimmer>:<Eventitem events={events}></Eventitem>}
            {/* {key&&<Eventitem events={events}></Eventitem>} */}
        </>
    )
}
export default EventsPage;