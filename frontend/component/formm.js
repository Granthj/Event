import react, { useRef, useState , useContext} from 'react';
import {AuthContext} from '../utils/authContext';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Auth from '../component/Auth';
import { cancelBooking } from '../../graphql/resolver';


const Form = ()=>{
    const [nameState,setnameState] = useState();
    const [emailState,setemailState] = useState();
    const [passState,setpassState] = useState();
    const [login,loginState] = useState(true);
    const [token,setToken] = useState();
    const [file,setFile] = useState();
    const [imageUrl,setImageUrl] = useState(null);
    const {tokenData, setTokenData} = useContext(AuthContext);
    const navigate = useNavigate();
    const inputFile = useRef(null);
    let val;
    if(token!==undefined){
        val = true;
    }
    const switchModeHandler = ()=>{
        if(login === true){
            return loginState(false);
        }
        return loginState(true);
    }
    const setInputHandler = ()=>{
        inputFile.current.click();
    }
    const imageSelector = (event)=>{
        setFile(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]));
        
    }

    const submit = (e)=>{
        e.preventDefault();
        console.log("in submit",nameState,emailState,passState);
    
        // if(emailState.trim().length === 0 || passState.trim().length === 0)
        //     return;
        let query;
        query=login?{
            query:`
                mutation{
                    createCustomer(customerInput:{name:"${nameState},"email:"${emailState}",password:"${passState}"}){
                        _id
                        email
                    }
                }
        `}:{
            query:`
                query{
                    login(email:"${emailState}"password:"${passState}"){
                        CustomerId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        
        fetch('http://localhost:7000/graphql',{
            method:'POST',
            body:JSON.stringify(query),
            headers:{
                'Content-Type':'application/json'
            }
        }).then(response=>{
            return response.json();
        }).then(data=>{
            console.log(data,"granth")
            if(!login){
                setTokenData(data.data.login.token);
                if(data.data.login.token){
                   
                    // navigate('/auth');
                    console.log(data.data.login.token)
                    return;
                }
            }
            // setToken(data.createCustomer._id);
        })
      
       
    }
    const customStyle = {
        marginTop:"20px",
        marginRight:"10px",
        marginLeft:"100px"

    }
    return(
        <>
        {login?<h1>Create Your Account</h1>:<h1>Log In</h1>}
        <div style={{width:"400px", height:"300px",border:"2px solid black",marginLeft:"540px",marginTop:"50px",backgroundColor:"orange"}}>
            <div>
            {/* {imageUrl?<img src={imageUrl} style={{borderRadius:"100%",border:"2px solid black", marginLeft:"95px",marginTop:"10px"}} onClick={setInputHandler} >
            </img>:
                <img src={require('../../image/dp.jpg')} style={{borderRadius:"100%",border:"2px solid black", marginLeft:"95px",marginTop:"10px"}} onClick={setInputHandler} >
                </img>} */}
                <input type="file" name="file" accept='image/*' ref={inputFile} onChange={imageSelector} style={{display:"none"}}></input>
            </div>    
            <form onSubmit={submit}>
                {login && <input type="name"placeholder="Enter Your Name" name="name" style={customStyle} onChange={(e)=>{setnameState(e.target.value)}}></input>}
                <input type="email" placeholder='Email' name="email" style={customStyle} onChange={(e)=>{setemailState(e.target.value)}}></input>
                <input type="password" placeholder='Password' name="pass" style={customStyle} onChange={(e)=>{setpassState(e.target.value)}}></input>
                <button type="submit">Click</button>
            </form>
                <button type="submit" style={customStyle} className='btn btn-primary' onClick={switchModeHandler}>Switch To {login?'SignUp':'Login'}</button>
        </div>
        </>
    )
}

export default Form;