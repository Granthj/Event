import react, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext, AuthProvider } from '../utils/authContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import { Link, NavLink } from 'react-router-dom';
import Search from './Search';
import logo from 'url:../assets/logo.png';



const Navbar = (props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const setAuthData = useContext(AuthContext);
    const logout = useContext(AuthContext);
    const navigate = useNavigate();
    function logOut() {
        setAuthData.setAuthData(null, null);
        logout.logout();
        navigate('/');
    }
    return (
        <>
            <nav className='navbar navbar-expand-lg  sticky-top' style={{ backgroundColor: "#0d6efd", minHeight: "60px", overflow: 'hidden' }}>
                <div className='container-fluid d-flex justify-content-between align-items-center'>
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                height: "60px",
                                maxHeight: "100%",
                                width: "auto",
                                objectFit: "contain"
                            }}
                        // className="img-fluid"
                        ></img>
                    </Link>


                    {/* Hamburger for mobile */}
                    <div className="d-lg-none position-relative" ref={dropdownRef}>
                        <button
                            className='btn'
                            onClick={toggleDropdown}
                            aria-label="Toggle menu"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Dropdown panel */}
                        {isDropdownOpen && (
                            <div className='dropdown-menu-box shadow'
                                style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}
                            >
                                <ul className='nav flex-column'>
                                    {setAuthData.token && (
                                        <>
                                            <li className='nav-item'>
                                                <NavLink to='/profile' className='nav-link' onClick={toggleDropdown}>My profile</NavLink>
                                            </li>
                                            <li className='nav-item'>
                                                <NavLink to='/bookings' className='nav-link' onClick={toggleDropdown}>Bookings</NavLink>
                                            </li>
                                            <li className='nav-item'>
                                                <NavLink to='/events-cart' className='nav-link' onClick={toggleDropdown}>Cart</NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                                <div className="my-2">
                                    <Search onCitySelected={props.onCitySelected} />
                                </div>
                                {setAuthData.token ? (
                                    <button onClick={() => { toggleDropdown(); logOut(); }} className='btn btn-danger w-100' style={{
                                        backgroundColor: "#e3f2fd",
                                        color: "#0d6efd",
                                        border: "none"
                                    }}>Logout</button>
                                ) : (
                                    <Link to='/login' className='btn btn-success w-100' style={{
                                        backgroundColor: "#e3f2fd",
                                        color: "#0d6efd",
                                        border: "none"
                                    }} onClick={toggleDropdown}>Login</Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop view */}
                    <div className='d-none d-lg-flex align-items-center'>
                        <ul className='navbar-nav nav-pills nav-fill'>
                            {setAuthData.token && (
                                <>
                                    <li className='nav-item'><NavLink to='/profile' className='nav-link'>My profile</NavLink></li>
                                    <li className='nav-item'><NavLink to='/bookings' className='nav-link'>Bookings</NavLink></li>
                                    <li className='nav-item'><NavLink to='/events-cart' className='nav-link'>Cart</NavLink></li>
                                </>
                            )}
                        </ul>
                        <Search onCitySelected={props.onCitySelected} />
                        {setAuthData.token ? (
                            <button onClick={logOut} className='btn btn-light ms-3' style={{ color: "#0d6efd" }}>Logout</button>
                        ) : (
                            <Link to='/login' className='btn btn-light ms-3' >Login</Link>
                        )}
                    </div>
                </div>
            </nav>
        </>


    )
}
export default Navbar;