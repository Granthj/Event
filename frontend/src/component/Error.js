import { useNavigate } from "react-router";
const Error = () => {
    const navigate = useNavigate();
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="Error"
                style={{ width: '200px', maxWidth: '90%' }}
                className="mb-4"
            />
            <h1 className="display-4 text-danger">Oops!</h1>
            <p className="lead">The page you're looking for doesn't exist or has been moved.</p>
            <button
                onClick={() => navigate('/')}
                className="btn btn-dark mt-3 px-4"
            >
                Go Home
            </button>
        </div>
    )
}
export default Error;