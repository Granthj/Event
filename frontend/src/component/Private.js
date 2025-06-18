import { useContext,useEffect } from "react"
import Error from "./Error";
import { AuthContext } from "../utils/authContext"
import { AdminAuthContext } from "../utils/adminAuth"
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
// import { BrowserRouter,Routes,Route } from 'react-router-dom';
import YourBooking from './YourBooking';
import Dashboard from "./Dashboard";
import EventsPage from "./Events";
import Spinner from "./Spinner";
import Profile from "./Profile";
import CartPage from "./CartPage";
import Login from "./Login";


const Private = ({path})=>{
    const setAuth = useContext(AuthContext);
    const {admintokenData,setAdminTokenData} = useContext(AdminAuthContext);
    console.log("Private in",path,admintokenData)
    const navigate = useNavigate();
try{
     if (setAuth.loading) {
        return <Spinner animation="grow" variant="warning"/> // Or a Spinner
    }

    if(path === "/profile"){
        return(
            setAuth.Email && setAuth.CustomerId ?<Profile/>:<Navigate to={`/login?referer=${encodeURIComponent(path)}`} replace />
    )
    }
    else if(path === "/bookings"){
        return setAuth.Email && setAuth.CustomerId ?<YourBooking/>:<Navigate to={`/login?referer=${encodeURIComponent(path)}`} replace />
    }
    else if(path == 'dashboard'){
        return(
            admintokenData?<Dashboard/>: <Navigate to="/admin" replace />
        )
    }
    else if(path === '/login'){
        return (
              setAuth.CustomerId ? <Navigate to="/" replace /> : <Login />
        )
    }
    else if(path == '/events-cart'){
        return(
            setAuth.Email && setAuth.CustomerId ?<CartPage/>:<Navigate to={`/login?referer=${encodeURIComponent(path)}`} replace />
        )
    }
} catch(err){
    console.error("Private route crashed, refresh the page:");
        return <div>Unexpected Error</div>;
}
}

export default Private;