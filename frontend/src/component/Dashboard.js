<<<<<<< HEAD
import react, { useRef, useState, useContext, useEffect } from 'react';
import Modal from './Modals';
import { AuthContext } from '../utils/authContext';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
=======
import react, { useRef, useState , useContext,useEffect} from 'react';
import Modal from './Modals';
import {AuthContext} from '../utils/authContext';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
import AdminEventList from './AdminEventList';

const Dashboard = () => {
    const [state, setState] = useState(false);
    const [title, setTitle] = useState();
    const [price, setPrice] = useState();
    const [desc, setDesc] = useState();
    const [date, setDate] = useState();
    const [city, setCity] = useState();
    const [State, set_State] = useState();
    const [address, setAddress] = useState();
<<<<<<< HEAD
    const [image,setImage] = useState();
    const [imageUrl,setImageUrl] = useState(null);
    const [value, setValue] = useState();
    const [bool, setBool] = useState(false);
    const [is, isSet] = useState(false);
=======
    const [value,setValue] = useState();
    const [bool,setBool] = useState(false);
    const [is,isSet] = useState(false);
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
    function setModalHandler() {
        setState(true);
    }
    function closeHandler() {
        setState(false);
    }
<<<<<<< HEAD
    const Upload = async ()=>{
        const formData = new FormData();
        formData.append('file',image)
        const res = await fetch("http://localhost:7000/upload-img",{
            method:'POST',
            body:formData
        })
    //       if (!res.ok) {
    //         const text = await res.text(); // get raw text to debug
    //         throw new Error(`Upload failed: ${res.status} - ${text}`);
    // }

    const data = await res.json();
    setImageUrl(data.imageUrl);
    console.log(data.imageUrl);
    }
    const valueConfirmHandler = (e) => {
        e.preventDefault();
        if(imageUrl === null){
            console.log('HELOO FROM RETURN')
            return;
        }
=======
    const valueConfirmHandler = (e) => {
        e.preventDefault();
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        let event = { title, price, date, desc };
        setState(false);
        const requestBody = {
            query: `
            mutation{
<<<<<<< HEAD
                createEvent(eventInput:{title:"${title}",price:${price},desc:"${desc}",date:"${date}",city:"${city}",state:"${State}",address:"${address}",image:"${imageUrl}"}){
=======
                createEvent(eventInput:{title:"${title}",price:${price},desc:"${desc}",date:"${date}",city:"${city}",state:"${State}",address:"${address}"}){
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
                    title
                    price
                    desc
                    date
                }
            }
            `
        }
        fetch('http://localhost:7000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': "Bearer" + " " + tokenData
            }
        }).then(response => {
            // if (response.status !== 200 && response.status !== 201) throw new Error('Failed');
            return response.json();
        }).then(data => {
        })
    }
    const eventReqBody = {
        query: `
        query{
            event{
                _id
                title
                price
                desc
                date
                city
                state
                address
                bookedBy{
                    email
                }
            }    
        }
        `
    }
    // useEffect(() => {
    //     function fetchData() {
    //         fetch('http://localhost:7000/graphql', {
    //             method: "POST",
    //             body: JSON.stringify(eventReqBody),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // 'Authorization': "Bearer" + " " + tokenData
    //             }
    //         })
    //             .then(response => {
    //                 // if(response.status !== 200 && response.status !== 201) throw new Error('Failed');
    //                 isSet(true);
    //                 return response.json();
    //             }).then(data => {
    //                 if (is) {
    //                     setValue(data.data.event); 
    //                     setBool(true);
    //                     // console.log("puy",data.data.event);  
    //                 }
    //             })
    //         }
    //         fetchData();
    //     }, [valueConfirmHandler])
    // if(bool){
    //     // console.log(value[0].bookedBy[0].email,"jcj")
    // }
    return (
        <>
<<<<<<< HEAD
            <h1>HELLO</h1>
            {state && <Modal close closeModal={closeHandler} confirm={valueConfirmHandler} >
                <form encType="multipart/form-data">
=======
        <h1>HELLO</h1>
            {state && <Modal close closeModal={closeHandler} confirm={valueConfirmHandler}>
                <form >
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
                    <label htmlFor='title'>Title</label>
                    <input className="form-control" type="text" onChange={(e) => { setTitle(e.target.value) }}></input>
                    <br></br>
                    <label htmlFor='price'>Price</label>
                    <input className="form-control" type="number" onChange={(e) => setPrice(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='date'>Date</label>
                    <input className="form-control" type="datetime-local" onChange={(e) => setDate(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='city'>City</label>
                    <input className="form-control" type="text" onChange={(e) => setCity(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='state'>State</label>
                    <input className="form-control" type="text" onChange={(e) => set_State(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='address'>Address</label>
                    <input className="form-control" type="text" onChange={(e) => setAddress(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='description'>Description</label>
                    <textarea className="form-control" type="text" onChange={(e) => setDesc(e.target.value)}></textarea>
<<<<<<< HEAD
                    <br></br>
                    <label htmlFor='image'>Image</label>
                    <input className="form-control" type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <button type="button" onClick={Upload}>upload</button>
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
                </form>
            </Modal>}
            {<button className='btn btn-primary' onClick={setModalHandler}>Create Event</button>}
            <br></br>
            {/* {bool&&<AdminEventList data={value}></AdminEventList>} */}

        </>
    )
}
export default Dashboard;