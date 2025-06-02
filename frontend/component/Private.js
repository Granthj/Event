import { useContext } from "react"
import Error from "./Error";
import Auth from "./Auth";
import { AuthContext } from "../utils/authContext"
import { AdminAuthContext } from "../utils/adminAuth"
import { Outlet, useNavigate } from 'react-router-dom';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import YourBooking from './YourBooking';
import Dashboard from "./Dashboard";
import EventsPage from "./Events";
import Profile from "./Profile";
import CartPage from "./CartPage";


const Private = ({path})=>{
    const {token,customerId} = useContext(AuthContext);
    const {admintokenData,setAdminTokenData} = useContext(AdminAuthContext);
    console.log("Private in",token,path,admintokenData)
    if(path === "/profile"){
        console.log(path)
        return(
            token?<Profile/>:<Error/>
    )
    }
    else if(path === "/bookings"){
        return token?<YourBooking/>:<Error/>
    }
    else if(path == 'dashboard'){
        return(
            admintokenData?<Dashboard/>:<Error/>
        )
    }
    // else if(path == '/events'){
    //     return(
    //         token?<EventsPage/>:<Error/>
    //     )
    // }
    else if(path == '/events-cart'){
        return(
            token?<CartPage/>:<Error/>
        )
    }
}

export default Private;