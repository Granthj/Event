import react, { use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContext, AuthProvider} from '../utils/authContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import { Link, NavLink } from 'react-router-dom';
const Navbar = ()=>{
    const setAuthData = useContext(AuthContext);
    const logout = useContext(AuthContext);
    console.log("Navbar",setAuthData);
    const navigate = useNavigate();
    function logOut(){
        setAuthData.setAuthData(null,null);
        logout.logout();
        navigate('/');
        console.log("in logout",localStorage.getItem('token'));
    }
    return(
        <react.Fragment>
            <nav className='navbar navbar-expand-lg bg-info'>
            <div className='container-fluid' >
                <h1 className='fst-italic' >Your Event</h1>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className=" custom-navbar navbar-nav ms-auto mb-2 mb-lg-0 nav-pills nav-fill ">
                    {setAuthData.token && <li className='custom-navbar-item nav-item '>
                        <NavLink to="/auth" className={"nav-link"}>My profile</NavLink>
                    </li>}
                    {setAuthData.token && <li className='nav-item custom-navbar-item'>
                        <NavLink to="/events" className={"nav-link"}>Events</NavLink>
                    </li>}
                    {setAuthData.token && <li className='nav-item custom-navbar-item'>
                        <NavLink to="/bookings" className={"nav-link"}>Bookings</NavLink>
                    </li>}
                    {setAuthData.token && <li className='nav-item custom-navbar-item'>
                        <NavLink to="/events-cart" className={"nav-link"}>Cart</NavLink>
                    </li>}
                </ul>
                    {setAuthData.token&&<button onClick={logOut} className='btn btn-light ms-3' >Logout</button>}
                </div>
                        
                    
            </div>
            </nav>
        </react.Fragment>
    )
}
export default Navbar;