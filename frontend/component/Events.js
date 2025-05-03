import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/authContext';
import Eventitem from './Eventitem';
import Shimmer from './shimmer';
const EventsPage = () => {

    const [events, setEvents] = useState([]);
    const [key, setKey] = useState(null);
    const { token, customerId } = useContext(AuthContext);

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
        console.log("BSDKKKK")
        function fetchData() {
            fetch('http://localhost:7000/graphql', {
                method: "POST",
                body: JSON.stringify(eventReqBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer" + " " + token
                }
            })
                .then(response => {
                    // if(response.status !== 200 && response.status !== 201) throw new Error('Failed');
                    return response.json();
                }).then(data => {
                    if (data.data !== null) {
                        console.log(token,"tokenFROMEVENTS")
                        console.log(data.data.event, "ok Error")
                        setEvents(data.data.event);
                        setKey(data.data.event);
                    }
                })
        }
        fetchData();
    }, [])
    return (
        <>  {! key ? <Shimmer></Shimmer> : <Eventitem events={events}></Eventitem>}
        </>
    )
}
export default EventsPage;