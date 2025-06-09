// import '../css/forgotPassword.css';
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from 'react';
import NewPassword from './NewPassword';

const ForgotPassword = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [countDown, setCountDown] = useState(10);
    const [sendOtp, setSendOtp] = useState(false);
    const [child, setChild] = useState(true);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resend_Otp, setResend_Otp] = useState(false);
    const [otpMatched, setOtpMatched] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sessionToken, setSessionToken] = useState(null);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleEmail = (e) => {
        setEmailError(false);
        setEmail(e.target.value);
    };
    const verifyOtp = (otp) => {
        const sendOtpData = {
            query: `
                query{
                    verifyOtp(otp:"${otp}",email:"${email}"){
                        sessionToken
                        success
                    }
                }
            `
        }
        fetch('http://localhost:7000/graphql', {
            method: 'POST',
            body: JSON.stringify(sendOtpData),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.errors) {
                const isOtpError = data.errors.some(err =>
                    err.message.toLowerCase().includes('OTP')
                );

                if (isOtpError) {
                    setChild(true);
                    setOtpMatched(true);
                    setShow(true);
                    setOtpExpired(true);
                }
                throw new Error(data.errors[0].message);
            }
            else {
                const result = data.data.verifyOtp;
                if (result.success) {
                    setSessionToken(result.sessionToken);
                }
            }
            // console.log(data, "response")
        }).catch(err => {
            // console.log(err.message, "error");
            setChild(true);
            setOtpMatched(true);
            setShow(true);
            setErrorMessage(err.message);
        })
        // .finally(() => {
        //     setIsLoading(false);
        // });
    }
    useEffect(() => {
        if (sessionToken) {
            // console.log("JJkkkJJ", sessionToken)
            setChild(false); // Move setChild here
        }
    }, [sessionToken]);
    const sendEmail = async () => {
        setIsLoading(true);
        const sendEmailData = {
            query: `
                query{
                    sendOtp(email:"${email}")
                }
            `
        }
        fetch('http://localhost:7000/graphql', {
            method: 'POST',
            body: JSON.stringify(sendEmailData),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log("IM IN fetch", response)
            return response.json();
        }).then((data) => {
            if (!resend_Otp) {
                if (data.errors) {
                    const isEmailError = data.errors.some(err =>
                        err.message.toLowerCase().includes('Email')
                    );

                    if (isEmailError) {
                        setEmailError(true);
                        setIsLoading(false);
                    }
                    throw new Error(data.errors[0].message);
                }
                else {
                    // setIsLoading(true);
                    setEmailError(false);
                    setSendOtp(true);
                }
            }
            setResend_Otp(false);
        })
            .catch(err => {
                console.log(err.message, "error");
                setEmailError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }

    const onClose = () => {
        setShow(false);
    }
    const confirmOtp = (otp) => {
        const stringOtp = otp.join('');
        verifyOtp(stringOtp)
        console.log(stringOtp);
    };

    const resendOtp = () => {
        setResend_Otp(true);
        sendEmail();
        setCountDown(10);
        setIsDisabled(false);
    };

    const handleOtp = (e) => {
        e.preventDefault();
        sendEmail();
    };

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

    useEffect(() => {
        if (sendOtp && countDown > 0) {
            const timer = setInterval(() => {
                setCountDown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (countDown === 0) {
            setIsDisabled(true);
        }
    }, [countDown, sendOtp]);

    return (
        <>
            {child ? (
                <div className="container my-2 my-md-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xs-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 bg-white p-2 p-md-4 rounded-3 shadow-sm border mx-auto"
                            style={{ minWidth: "210px", overflowX: "hidden" }}>
                            {!sendOtp && (
                                <div>
                                    <h2 className="mb-3 mb-md-4 text-center fs-4 fw-bold">Forgot Password</h2>
                                    <form onSubmit={handleOtp}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label small">Email Address</label>
                                            <input
                                                type="email"
                                                className={`form-control form-control-sm ${emailError ? 'is-invalid' : ''}`}
                                                id="email"
                                                placeholder="Enter your email"
                                                required
                                                onChange={handleEmail}
                                                value={email}
                                            />
                                            {!resend_Otp && emailError && (
                                                <div
                                                    className="text-danger small w-100"
                                                    style={{
                                                        // position: 'absolute',
                                                        bottom: '-60px',
                                                        left: '0'
                                                    }}
                                                >
                                                    Incorrect email. Please try again.
                                                </div>
                                            )}
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
                                            </>) : (
                                                <button type="submit" className="btn btn-dark btn-sm w-100 py-2" onClick={(e) => handleOtp(e)}>Send OTP</button>)}
                                        </div>
                                    </form>
                                </div>
                            )}
                            {sendOtp && (
                                <div className="text-center">
                                    <h3 className="mb-2 mb-md-3 fs-5 fw-bold">Enter OTP</h3>
                                    <p className="small text-muted mb-3">We've sent a 4-digit code to <strong>{email}</strong></p>

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
                                        </div>
                                    </div>
                                    {otpMatched && (
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
                                        </Modal>)}
                                    <div className="mb-3">
                                        {isDisabled ? (
                                            <button
                                                type="button"
                                                className="btn btn-link btn-sm p-0"
                                                onClick={resendOtp}
                                            >
                                                Resend OTP
                                            </button>
                                        ) : (
                                            <div className="small text-muted timer">
                                                Resend OTP in {countDown}
                                            </div>
                                        )}
                                    </div>

                                    <div className="small">
                                        <Link to="/login" className="text-decoration-none">Back to Login</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            ) : (
                <NewPassword token={sessionToken} />
            )}
        </>

    );
};

export default ForgotPassword;
