import react, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Spinner } from "react-bootstrap";
import '../css/form.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


const SignUp = () => {
    const [firstnameState, setfirstnameState] = useState();
    const [lastnameState, setlastnameState] = useState();
    const [dobState, setdobState] = useState();
    const [genderState, setgenderState] = useState('');
    const [emailState, setemailState] = useState();
    const [passState, setpassState] = useState();
    const [confirmPassword,setconfirmpassState] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [emailExistError, setEmailExistError] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');
    const [done,setDone] = useState(false);
    const [show,setShow] = useState(false);
    const referenceMale = useRef(null);
    const referenceFemale = useRef(null);
    const navigate = useNavigate();

     const toLogin = () => {
        navigate('/login');
     }
     const onClose = ()=>{
        setShow(false);
     }
     const submitData = () =>{
         const query = {
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
                }`
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
            if(data.errors){
                // const existEmail = data.errors.some(err =>
                //         err.message.toLowerCase().includes('exists')
                //     );
                throw new Error(data.errors[0].message);
            }
            else{
                navigate('/login');
            }
        }).catch(err =>{
            setEmailExistError(true);
        })
     }
      const verifyOtp = (otp) => {
        const query = {
            query: `
                query{
                    verifyOtpNewAccount(otp:"${otp}",email:"${emailState}")
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
            if (data.errors) {
                const isOtpError = data.errors.some(err =>
                    err.message.toLowerCase().includes('OTP')
                );
                setShow(true)
                throw new Error(data.errors[0].message);
            }
            else{
                submitData();

            }
        }).catch(err => {
            setShow(true)
            // setOtpError(true);
            setErrorMessage(err.message)
        })

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
    const handleDelete = (e) => {
        if (e.key === 'Backspace') {
            const currentInput = e.target;
            const prevSibling = currentInput.previousElementSibling;
            const cursorPosition = currentInput.selectionStart;
            if (currentInput.value !== '' && cursorPosition === 0) {
                currentInput.value = '';
                currentInput.focus();
            } else if (currentInput.value === '' && prevSibling) {
                prevSibling.focus();
                const length = prevSibling.value.length;
                prevSibling.setSelectionRange(length, length);
            }
        }
    };
      const confirmOtp = (otp) => {
        const stringOtp = otp.join('');
        verifyOtp(stringOtp);
    };

    const handleInputChange = (e) => {
        const target = e.target;
        const nextSibling = target.nextElementSibling;

        if (target.value !== '') {
            if (nextSibling) {
                nextSibling.focus();
            }
        }

        const allInput = Array.from(e.target.parentNode.querySelectorAll('.otp-inputs input'));
        const otpValues = allInput.map(input => input.value);
        if (otpValues.every(val => val !== '')) {
            confirmOtp(otpValues);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmailExistError(false);
        }
        // if (name === 'password') {
        //     setPasswordError(false);
        // }
         if (name === 'confirmpassword' || name === 'password') {
            setConfirmPasswordError(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if(passState !== confirmPassword){
            setConfirmPasswordError(true);
            return;
        }
       
         const query = {
            query: `
                query{
                    sendOtpNewAccount(email:"${emailState}")
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
            if (data.errors) {
                const existEmail = data.errors.some(err =>
                    err.message.toLowerCase().includes('already')
                );
                if (existEmail) {
                    setEmailExistError(true);
                }
                throw new Error(data.errors[0].message);
            }
            else{
                console.log("data Submitted")
                setDone(true);

            }
        }).catch(err => {

        })
    }
    return (
        <>
            {!done?(<div className="container mt-5" style={{marginBottom: "50px"}}>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                        {/* Box with shadow */}
                        <div className="card shadow rounded p-4">
                            <h4 className="text-center mb-4">Registration Form</h4>

                            <form onSubmit={submitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="firstname" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Your First Name"
                                        name="firstname"
                                        className="form-control"
                                        onChange={(e) => setfirstnameState(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lastname" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Your Last Name"
                                        name="lastname"
                                        className="form-control"
                                        onChange={(e) => setlastnameState(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        className="form-control"
                                        onChange={(e) => setdobState(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Gender</label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="gender"
                                            value="male"
                                            ref={referenceMale}
                                            onChange={(e) => handleCheckBox(e.target.value)}
                                            id="genderMale"
                                        />
                                        <label className="form-check-label" htmlFor="genderMale">Male</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="gender"
                                            value="female"
                                            ref={referenceFemale}
                                            onChange={(e) => handleCheckBox(e.target.value)}
                                            id="genderFemale"
                                        />
                                        <label className="form-check-label" htmlFor="genderFemale">Female</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        className={`form-control ${emailExistError ? 'is-invalid' : ''}`}
                                        onChange={(e)=>{setemailState(e.target.value),handleChange(e)}}
                                    />
                                     {emailExistError ? (
                                         <div className="invalid-feedback d-block">Email already exists.</div>):
                                         (<div className="form-text">We'll never share your email with anyone else.</div>)} 
                                </div>

                                <div className="mb-3 input-group">
                                    <input
                                         type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        name="password"
                                        className="form-control"
                                        onChange={(e) => {setpassState(e.target.value), handleChange(e)}}
                                    />
                                    <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                </button>
                                </div>
                                <div className="mb-3 input-group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Password"
                                        name="confirmpassword"
                                        className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                        onChange={(e) => {setconfirmpassState(e.target.value),handleChange(e)}}
                                    />
                                     {confirmPasswordError && (
                                                <div
                                                    className="text-danger small w-100"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-19px',
                                                        left: '0'
                                                    }}
                                                >
                                                    Password do not matched.
                                                </div>
                                            )}
                                     <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-dark w-100">Submit</button>
                                </div>
                            </form>
                                <div className="text-center mt-3">
                                    <button type="submit" className='btn btn-secondry' onClick={toLogin}>Switch To Login</button>
                                </div>
                        </div>

                    </div>
                </div>
            </div>)
            : (
                <div className="container my-2 my-md-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xs-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-white p-2 p-md-4 rounded-3 shadow-sm border mx-auto"
                            style={{ minWidth: "210px", overflowX: "hidden" }}>
                            <div className="text-center">
                                <h3 className="mb-2 mb-md-3 fs-5 fw-bold">Enter OTP</h3>
                                <p className="small text-muted mb-3">We've sent a 4-digit code to <strong>{emailState}</strong></p>

                                <div className="d-flex justify-content-center mb-3 mb-md-4 otp-inputs"
                                    style={{
                                        minWidth: "100%",
                                        overflowX: "auto",
                                        scrollbarWidth: "none", /* Firefox */
                                        msOverflowStyle: "none" /* IE/Edge */
                                    }}>
                                    <div className="d-flex gap-1 gap-md-4" style={{ minWidth: "fit-content" }}>
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <input
                                                type="text"
                                                key={index}
                                                maxLength="1"
                                                className="form-control form-control-sm text-center"
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    fontSize: "1rem",
                                                    minWidth: "40px"
                                                }}
                                                required
                                                onChange={handleInputChange}
                                                onKeyDown={handleDelete}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    if (!/^[0-9]?$/.test(value)) {
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        ))}
                                        {/* Modal component should be outside the input mapping */}
                                        <Modal show={show} onHide={onClose} centered>
                                            <Modal.Header closeButton style={{ backgroundColor: "#4CAF50", color: "white" }}>
                                                <Modal.Title>Fail!</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <p>{errorMessage}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="success" onClick={onClose}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

        </>
    );
};

export default SignUp;