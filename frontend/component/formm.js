import react, { useRef, useState, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { useNavigate } from 'react-router-dom';
import '../css/form.css';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Auth from '../component/Auth';
import { cancelBooking } from '../../graphql/resolver';

const Form = () => {
    const [firstnameState, setfirstnameState] = useState();
    const [lastnameState, setlastnameState] = useState();
    const [dobState, setdobState] = useState();
    const [genderState, setgenderState] = useState('');
    const [emailState, setemailState] = useState();
    const [passState, setpassState] = useState();
    const [login, loginState] = useState(false);
    const [token, setToken] = useState();
    const [file, setFile] = useState();
    const [imageUrl, setImageUrl] = useState(null);
    const { setAuthData } = useContext(AuthContext);
    const referenceMale = useRef(null);
    const referenceFemale = useRef(null);
    const navigate = useNavigate();
    const inputFile = useRef(null);
    let val;
    console.log(setAuthData, "in form")
    if (token !== undefined) {
        val = true;
    }
    const switchModeHandler = () => {
        if (login === false) {
            return loginState(true);
        }
        return loginState(false);
    }
    const setInputHandler = () => {
        inputFile.current.click();
    }
    const imageSelector = (event) => {
        setFile(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]));

    }
    const handleCheckBox = (value) => {

        if (value === 'male') {
            referenceMale.current.checked = true;
            referenceFemale.current.checked = false;
            setgenderState(value);
        }
        else {
            referenceMale.current.checked = false;
            referenceFemale.current.checked = true;
            setgenderState(value);
        }

    }
    const submit = (e) => {
        e.preventDefault();
        loginState(false);
        // console.log("in submit",nameState,emailState,passState);
        console.log("in submit", firstnameState, lastnameState, dobState, genderState, emailState, passState);

        // if(emailState.trim().length === 0 || passState.trim().length === 0)
        //     return;
        let query;
        query = login ? {
            query: `
            mutation{
                    createCustomer(customerInput:{firstname:"${firstnameState}",lastname:"${lastnameState}",dob:"${dobState}",gender:"${genderState}",email:"${emailState}",password:"${passState}"}){
                        _id
                        email
                        firstname
                        lastname
                        dob
                        gender
                    }
                    }
                    `} : {
            query: `
                        query{
                            login(email:"${emailState}"password:"${passState}"){
                        CustomerId
                        token
                        tokenExpiration
                        }
                        }
                        `
        }

        fetch('http://localhost:7000/graphql', {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data, "granth")
            if (!login) {
                // setTokenData(data.data.login);
                console.log(data.data, "GHUIOP")
                setAuthData(data.data.login.token, data.data.login.CustomerId);
                // localStorage.setItem('token',data.data.login.token);
                localStorage.setItem('customerId', data.data.login.CustomerId);
                return;
                // if(data.data.login.token){

                // navigate('/auth');
                // }
            }
            // setToken(data.createCustomer._id);
        })


    }
    return (
        <>
            {login ? <h1>Create Your Account</h1> : <h1>Log In</h1>}
            <div className="container mt-5 custom-container w-25">

                <form onSubmit={submit} >
                    {login ? (

                        <div>
                            <div>
                                <div className="mb-2">
                                    <label htmlFor="firstname" className="form-label">First Name</label>
                                    <br></br>
                                    <input type="firstname" placeholder="Enter Your First Name" name="firstname" className="form-control w-100" onChange={(e) => { setfirstnameState(e.target.value) }}></input>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="lastname" className="form-label">Last Name</label>
                                    <input type="lastname" placeholder="Enter Your Last Name" name="lastname" className="form-control w-100" onChange={(e) => { setlastnameState(e.target.value) }}></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                                    <input type="date" placeholder="Enter Your Date of Birth" name="dob" className="form-control w-100" onChange={(e) => { setdobState(e.target.value) }}></input>
                                </div>
                                {/* <br></br> */}
                                <div className="mb-2 row align-items-center">
                                    <label className="col-sm-4 col-form-label">Gender</label>
                                    <br></br>
                                    <div className="col-sm-10">
                                        <input type="checkbox" className="form-check-input" name="gender" value="male" ref={referenceMale} onChange={(e) => handleCheckBox(e.target.value)}></input>
                                        <label className="form-check-label" htmlFor='male'>Male</label>
                                    </div>
                                    <div className="col-sm-10">
                                        <input type="checkbox" className="form-check-input" name="gender" value="female" ref={referenceFemale} onChange={(e) => handleCheckBox(e.target.value)}></input>
                                        <label className="form-check-label" htmlFor='female'>Female</label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                    <input type="email" placeholder='Email' name="email" className="form-control w-100" aria-describedby="emailHelp" onChange={(e) => { setemailState(e.target.value) }}></input>
                                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div className='mb-3'>
                                    <input type="password" placeholder='Password' name="pass" className="form-control w-100" onChange={(e) => { setpassState(e.target.value) }}></input>
                                </div>
                                <div className='text-center'>
                                    <button type="submit" className="btn btn-primary" >Submit</button>
                                </div>
                            </div>
                        </div>) :

                        (<div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" placeholder='Email' name="email" className="form-control w-100" aria-describedby="emailHelp" required onChange={(e) => { setemailState(e.target.value) }}></input>
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className='mb-3'>
                                <input type="password" placeholder='Password' name="pass" className="form-control w-100" required onChange={(e) => { setpassState(e.target.value) }}></input>
                            </div>
                            <div className='text-center'>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>)}

                </form>
                <div className='text-center'>
                    <button type="submit" className='btn btn-secondry' onClick={switchModeHandler}>Switch To {login ? 'Login' : 'SignUp'}</button>
                    <div className="text-end mt-3"> {/* Align to right with margin-top */}
                        <Link
                            to="/forgot-password"
                            className="text-decoration-none"
                            style={{
                                color: '#6c757d',
                                transition: 'all 0.3s ease',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                                display: 'inline-block',
                                position: 'relative',
                                paddingBottom: '2px'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                            onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                        >
                            Forgot Password?
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '0%',
                                    height: '1px',
                                    backgroundColor: '#0d6efd',
                                    transition: 'width 0.3s ease'
                                }}
                                className="hover-underline"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Form;