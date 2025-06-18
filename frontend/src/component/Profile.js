import { useContext, useEffect, useState } from 'react';
import { Modal, Button, Spinner } from "react-bootstrap";
import { AuthContext } from '../utils/authContext';
import '../css/profile.css';
import EmailChange from './EmailChange';
const Profile = () => {
    const setAuth = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    // const [emailError, setEmailError] = useState(false);
    const [emailchange,setEmailChange] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        dob: '',
        gender: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    const onClose = () => {
        setShow(false);
        setUpdated(false);
    }
    useEffect(() => {
        const getData = {
            query: `
            query{
            customerData(customerId:"${setAuth.CustomerId}"){
                firstname
                lastname
                dob
                gender
                email
            }
        }
            `
        }
        fetch('http://localhost:7000/graphql', {
            method: "POST",
            body: JSON.stringify(getData),
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': "Bearer" + " " + token
            },
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data, "HELLO");
            setFormData(prev => ({
                ...prev,
                firstname: data.data.customerData.firstname || '',
                lastname: data.data.customerData.lastname || '',
                dob: data.data.customerData.dob || '',
                gender: data.data.customerData.gender || '',
                email: data.data.customerData.email || ''
            }));
            // console.log(data.data.customerData, "HELLO");
        })

    }, [])
    const changeEmail=()=>{
        setEmailChange(true);
    }
    function formatTimestampToDateInput(timestampString) {
        // Convert the string to a number
        const timestamp = Number(timestampString);

        // Check if it's a valid number
        if (isNaN(timestamp)) {
            console.error('Invalid timestamp:', timestampString);
            return ''; // Return empty or handle error as needed
        }

        // Create Date object from timestamp
        const date = new Date(timestamp);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid date from timestamp:', timestamp);
            return '';
        }

        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    const handleDateChange = (e) => {
        const dateString = e.target.value;
        if (!dateString) return;

        const date = new Date(dateString);
        const timestamp = date.getTime().toString();

        setFormData(prev => ({
            ...prev,
            dob: timestamp
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            // If the first character is invalid, ignore the change
            const emailRegex = /^[a-z][a-zA-Z0-9._%+-]*@?[a-zA-Z0-9.-]*\.?[a-zA-Z]*$/
            if (value.length === 1 && !/^[a-zA-Z0-9]/.test(value)) {
                return; // Block the input
            }
        }

        if (name === 'password') {
            setPasswordError(false);
        }
        if (name === 'confirmPassword' || name === 'newPassword') {
            setConfirmPasswordError(false);
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.confirmPassword !== formData.newPassword) {
            setConfirmPasswordError(true);
            return;
        }
        setIsLoading(true);
        const updateData = {
            query: `
            mutation{
                updateCustomerData(updateCustomerInput:{customerId:"${setAuth.CustomerId}",
                firstname:"${formData.firstname}",
                lastname:"${formData.lastname}",
                dob:"${formData.dob}",
                gender:"${formData.gender}",
                email:"${formData.email}",
                password:"${formData.password}",
                newPassword:"${formData.newPassword}"}){
                    firstname
                    lastname
                    dob
                    gender
                    email
            }
        }
            `
        }
        fetch('http://localhost:7000/graphql', {
            method: "POST",
            body: JSON.stringify(updateData),
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': "Bearer" + " " + token
            },
            credentials: 'include'
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.errors) {
                    const isPasswordError = data.errors.some(err =>
                        err.message.toLowerCase().includes('password')
                    );

                    if (isPasswordError) {
                        setPasswordError(true);
                        setIsLoading(false);
                    }
                    throw new Error(data.errors[0].message);
                }
                else {
                    setIsLoading(false);
                    setUpdated(true);
                    setShow(true);
                    setTimeout(() => {
                        setShow(false);
                        setUpdated(false);
                    }, 2000);
                }

            })
            .catch(err => {
                setPasswordError(true);
            })

    }

    return (
        <>
        {!emailchange?(<div style={{ marginBottom:"50px"}}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h4 className="mb-0">Update Profile</h4>
                            </div>
                            <div className="card-body">

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="firstName" name="firstname"
                                            placeholder="Enter first name"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" name="lastname"
                                            placeholder="Enter last name"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                                        <input type="date" className="form-control" id="dob" name="dob"
                                            value={formatTimestampToDateInput(formData.dob)}
                                            onChange={handleDateChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Gender</label>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio"
                                                name="gender"
                                                id="male"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="male">
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio"
                                                name="gender"
                                                id="female"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            />
                                            <label className="form-check-label" htmlFor="female">
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <div className="input-group">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                placeholder="Enter email"
                                                value={formData.email}
                                                disabled
                                            />
                                            <button
                                                className="btn btn-dark"
                                                type="button"
                                                onClick={changeEmail}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            {passwordError && (
                                                <div
                                                    className="text-danger small w-100"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-22px',
                                                        left: '0'
                                                    }}
                                                >
                                                    Incorrect password. Please try again.
                                                </div>
                                            )}
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">New Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                className="form-control"
                                                id="newPassword"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
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
                                    </div>


                                    <div className="d-grid gap-2" style={{ marginTop: '30px' }}>
                                        {isLoading ? (<>
                                            <div
                                                className="d-flex flex-column justify-content-center align-items-center"
                                                style={{ minHeight: "100px" }} // Adjust height as needed
                                            >
                                                <div className="d-flex align-items-center" style={{ height: "2rem" }}>
                                                    {[0, 0.3, 0.6].map((delay) => (
                                                        <div
                                                            key={delay}
                                                            className="bouncing-dot"
                                                            style={{ animationDelay: `${delay}s` }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ms-2">Submitting...</span></div>
                                        </>) : (<button type="submit" className="btn btn-dark">Update Profile</button>)}

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {updated && (
                <Modal show={show} onHide={onClose} centered>
                    <Modal.Header closeButton style={{ backgroundColor: "#4CAF50", color: "white" }}>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Your form has been Updated successfully!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={onClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>)}
                </div>):(<EmailChange email={formData.email}/>)}
        </>
    )
}

export default Profile;