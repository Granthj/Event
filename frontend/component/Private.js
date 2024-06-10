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


const Private = ({path})=>{
    const {tokenData,setTokenData} = useContext(AuthContext);
    const {admintokenData,setAdminTokenData} = useContext(AdminAuthContext);
    console.log("Private in",tokenData,path,admintokenData)
    if(path === "/auth"){
        console.log(path)
        return(
        tokenData?<Auth/>:<Error/>
    )
    }
    else if(path === "/bookings"){
        return tokenData?<YourBooking/>:<Error/>
    }
    else if(path == 'dashboard'){
        return(
            admintokenData?<Dashboard/>:<Error/>
        )
    }
    else if(path == '/events'){
        return(
            tokenData?<EventsPage/>:<Error/>
        )
    }
}

export default Private;