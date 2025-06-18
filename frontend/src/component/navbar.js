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
    const dropdownButtonRef = useRef(null);    // hamburger button
    const dropdownBoxRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
        // setIsDropdownOpen(!isDropdownOpen)
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownButtonRef.current &&
                !dropdownButtonRef.current.contains(event.target) &&
                dropdownBoxRef.current &&
                !dropdownBoxRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const setAuth = useContext(AuthContext);
    const {logOut} = useContext(AuthContext);
    const navigate = useNavigate();
    function logout() {
        
        logOut();
        navigate('/');
    }
    console.log("setAuth", setAuth.Email,setAuth.CustomerId);
    return (
        <>
            <nav className='navbar navbar-expand-lg  sticky-top' style={{ backgroundColor: "#0d6efd", minHeight: "60px" }}>
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
                    <div className="d-lg-none position-relative" ref={dropdownButtonRef}>
                        <button
                            className='btn'
                            onClick={toggleDropdown}
                            aria-label="Toggle menu"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Dropdown panel */}
                        {/* {isDropdownOpen && (
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
                        )} */}
                    </div>

                    {/* Desktop view */}
                    <div className='d-none d-lg-flex align-items-center'>
                        <ul className='navbar-nav nav-pills nav-fill'>
                            {setAuth.Email && setAuth.CustomerId && (

                                <>
                                    <li className='nav-item'><NavLink to='/profile' className='nav-link'><strong>My Profile</strong></NavLink></li>
                                    <li className='nav-item'><NavLink to='/bookings' className='nav-link'><strong>Bookings</strong></NavLink></li>
                                    <li className='nav-item'><NavLink to='/events-cart' className='nav-link'><strong>Cart</strong></NavLink></li>
                                </>
                            )}
                        </ul>
                        <Search onCitySelected={props.onCitySelected} />
                        {setAuth.Email && setAuth.CustomerId ? (
                            <button onClick={logout} className='btn btn-light ms-3' style={{ color: "#0d6efd" }}><strong>Logout</strong></button>
                        ) : (
                            <Link to='/login' className='btn btn-light ms-3' style={{ color: "#0d6efd" }}><strong>Login</strong></Link>
                        )}
                    </div>
                </div>
            </nav>
            {isDropdownOpen && (
                <div className='dropdown-menu-box shadow d-lg-none sticky-top'
                    ref={dropdownBoxRef}
                    style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul className='nav flex-column'>
                        {setAuth.Email && setAuth.CustomerId && (
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
                    <div className="my-2 mx-3">
                        <Search onCitySelected={props.onCitySelected} />
                    </div>
                    {setAuth.Email && setAuth.CustomerId ? (
                        <button onClick={() => { toggleDropdown(); logout(); }} className='btn btn-danger w-100' style={{
                            backgroundColor: "#e3f2fd",
                            color: "#0d6efd",
                            border: "none"
                        }}><strong>Logout</strong></button>
                    ) : (
                        <Link to='/login' className='btn btn-success w-100' style={{
                            backgroundColor: "#e3f2fd",
                            color: "#0d6efd",
                            border: "none"
                        }} onClick={toggleDropdown}><strong>Login</strong></Link>
                    )}
                </div>
            )}
        </>


    )
}
export default Navbar;