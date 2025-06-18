import { useEffect, useState } from 'react';
import '../css/forgotPassword.css';
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";

const NewPassword = (props) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            console.log("new", newPassword);
            console.log("confirm", confirmPassword);
            setConfirmPasswordError(true);
            return;
        }
        const sendData = {
            query: `
                mutation{
                    updateCustomerPassword(updatePasswordInput:{password:"${newPassword}", sessionToken:"${props.token}"})
                }
            `
        }
        fetch("http://localhost:7000/graphql", {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            return response.json();
        }).then(data => {
            setSuccess(data.data.updateCustomerPassword);
            console.log(data);
        })

    };
    useEffect(() => {
        if (success) {
            setSuccessMessage(true); 
            setShow(true);          
        }
    }, [success]);
    const onClose = () => {
        setShow(false);      
        navigate('/login');       

    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "confirmPassword") {
            setConfirmPasswordError(false);
        }
    }

    return (
        <div className="container mt-5" style={{ marginBottom: "100px" }}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">Update Password</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            onChange={(e) => setNewPassword(e.target.value)}
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
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                handleChange(e);
                                            }}
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
                                    </>) : (<button type="submit" className="btn btn-dark">Update Password</button>)}


                                </div>
                                {successMessage && <Modal show={show} onHide={onClose} centered>
                                    <Modal.Header closeButton style={{ backgroundColor: "#4CAF50", color: "white" }}>
                                        <Modal.Title>Success!</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p><strong>Password upated successfully!</strong></p>
                                    </Modal.Body>
                                </Modal>}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default NewPassword;