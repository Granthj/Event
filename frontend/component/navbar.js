import react from 'react';
import {AuthContext, AuthProvider} from '../utils/authContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import { Link, NavLink } from 'react-router-dom';
const Navbar = ()=>{
    const Auth = useContext(AuthContext);
    const navigate = useNavigate();
    function logOut(){
        Auth.setTokenData(null);
        navigate('/');
    }
    return(
        <react.Fragment>
            <div id="container_nav">
                <h1>hbx
                <ul id="ul_nav">
                    {Auth.tokenData && <li>
                        <NavLink to="/auth">Authenticate</NavLink>
                    </li>}
                    {Auth.tokenData && <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>}
                    {Auth.tokenData && <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                    </li>}
                </ul>
                        </h1>
                    
            </div>
            {Auth.tokenData&&<button onClick={logOut}>Logout</button>}
        </react.Fragment>
    )
}
export default Navbar;