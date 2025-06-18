import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
const EmailChange = (props) => {
    const [done, setDone] = useState(false);
    const [newEmail, setNewEmail] = useState();
    const [emailExistError, setEmailExistError] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [show,setShow] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');
    const verifyOtp = (otp) => {
        const query = {
            query: `
                query{
                    verifyOtpEmail(otp:"${otp}",email:"${newEmail}",oldEmail:"${props.email}")
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
<<<<<<< HEAD
            console.log(data,"in side otp")
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            if (data.errors) {
                const isOtpError = data.errors.some(err =>
                    err.message.toLowerCase().includes('OTP')
                );
                throw new Error(data.errors[0].message);
            }
            else{
<<<<<<< HEAD
                setShow(true)
=======
                window.location.reload();

>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            }
        }).catch(err => {
            setShow(true)
            setOtpError(true);
            setErrorMessage(err.message)
        })

    }
    const onClose=()=>{
        setShow(false);
<<<<<<< HEAD
        window.location.reload();
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
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
        verifyOtp(stringOtp)
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

    const submit = async (e) => {
        e.preventDefault();
        console.log("BURRR",newEmail)
        const query = {
            query: `
                query{
                    sendOtpforNewEmail(email:"${newEmail}")
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
            {!done ? (<div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
                    <h4 className="text-center mb-4">Update Email</h4>
                    <form onSubmit={submit}>
                        {/* Current Email (Disabled) */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Current Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={props.email}
                                disabled
                            />

                        </div>

                        {/* New Email */}
                        <div className="mb-3">
                            <label htmlFor="newEmail" className="form-label">New Email</label>
                            <input
                                type="email"
                                className={`form-control ${emailExistError ? 'is-invalid' : ''}`}
                                id="newEmail"
                                placeholder="Enter new email"
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            {emailExistError && (
                                <div className="invalid-feedback d-block">Email already exists.</div>)}
                        </div>

                        <div className="d-grid">
                            <button className="btn btn-dark" type="submit">
                                Update Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>) :
                (<div className="container my-2 my-md-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xs-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-white p-2 p-md-4 rounded-3 shadow-sm border mx-auto"
                            style={{ minWidth: "210px", overflowX: "hidden" }}>
                            <div className="text-center">
                                <h3 className="mb-2 mb-md-3 fs-5 fw-bold">Enter OTP</h3>
                                <p className="small text-muted mb-3">We've sent a 4-digit code to <strong>{newEmail}</strong></p>

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
                </div>)}
        </>
    )
}
export default EmailChange;