import { useState, useContext } from "react"
import { useNavigate} from "react-router";
import { AuthContext } from '../utils/authContext';
import { useLocation,Link } from "react-router-dom";


const Login = ()=>{
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [showPassword,setShowPassword] = useState();
    const [isError,setIsError] = useState(false);
    const { setAuth } = useContext(AuthContext);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const referer = params.get("referer") || "/";
    const navigate = useNavigate();

    const toLogin = ()=>{
        navigate("/signup");
    }
    const handleChange = (e)=>{
        const {name,value} = e.target;
        if(name === "email" || name === "password"){
            setIsError(false)
        }
    }
    const submitHandler = (e)=>{
        e.preventDefault();
        console.log(email,password)
        const query = {
            query:`
                query{
                    login(email:"${email}",password:"${password}"){
                        CustomerId
                        Email
                        }
                    }
            `
        }
          fetch('http://localhost:7000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(query),
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log("DETA",data.data)
            if(data.errors){
                // const existEmail = data.errors.some(err =>
                //     err.message.toLowerCase().includes('already')
                // );
                // if (existEmail) {
                //     setEmailExistError(true);
                // }
                setIsError(true);
                // throw new Error(data.errors[0].message);
            }
            else{
                console.log("DATAFROM COOKIE",data.data.login.CustomerId, data.data.login.Email);
                setAuth(data.data.login.CustomerId, data.data.login.Email);
                // localStorage.setItem('customerId', data.data.login.CustomerId);
                // localStorage.setItem('token', data.data.login.token);
                navigate(referer || "/");
                // navigate("/");
            }
        })
    }
    return(
        <>
            <div className="container mt-5" style={{marginBottom: "50px"}}>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                        {/* Box with shadow */}
                        <div className="card shadow rounded p-4">
                            <h4 className="text-center mb-4">Login</h4>
                            {isError&&<div className="invalid-feedback d-block">Incorrect email or password.</div>}
                            <form onSubmit={submitHandler}>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        className={`form-control ${isError ? 'is-invalid' : ''}`}
                                        onChange={(e)=>{setEmail(e.target.value),handleChange(e)}}
                                    />
                                     
                                </div>

                                <div className="mb-3 input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        name="password"
                                        className={`form-control ${isError ? 'is-invalid' : ''}`}
                                        onChange={(e) => {setPassword(e.target.value),handleChange(e)}}
                                    />
                                    <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                </button>
                                </div>
                 
                                

                                <div className="text-center">
                                    <button type="submit" className="btn btn-dark w-100">Submit</button>
                                </div>
                            </form>
                                <div className="text-center mt-3">
                                    <button type="submit" className='btn btn-secondry' onClick={toLogin}>Create an account</button>
                                </div>
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
                </div>
            </div>
        
        </>

    )
}
export default Login;