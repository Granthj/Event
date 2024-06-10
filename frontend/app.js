import {useState, useContext, useEffect } from 'react';
import ReactDom from 'react-dom/client';
import Navbar from './component/navbar.js';
import Form from './component/formm.js';
import New from './component/new.js';
import Auth from './component/Auth.js';
import EventsPage from './component/Events.js';
import YourBooking from './component/YourBooking.js';
import Footer from './component/Footer.js';
import Private from './component/Private.js';
import Admin from './component/Admin.js';
import Dashboard from './component/Dashboard.js';
import AdminNavbar from './component/AdminNavbar.js';
import { AuthContext, AuthProvider} from './utils/authContext.js';
import {AdminAuthContext, AdminAuthProvider} from './utils/adminAuth.js'
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route, useNavigate, Outlet, createRoutesFromElements } from 'react-router-dom';
import Booking from '../model/booking.js';
import CustomersList from './component/Customers.js';
import Eventitem from './component/Eventitem.js';
import PaymentGateway from './component/PaymentGateway.js';
import { PaymentProvider,PaymentContext } from './utils/paymentId.js';
let val = false;
const AdminPanel = ()=>{
    return(
        <>
            <AdminAuthProvider>
                <AdminNavbar/>
                <Admin/>
                <Outlet/>
                {/* <Dashboard/> */}
            </AdminAuthProvider>
            
        </>
    )
}
const AppLayOut = () => {
    const { tokenData, setTokenData } = useContext(AuthContext);
    return(
        <div>

        <AuthProvider>
            <PaymentProvider>
                    <Navbar/>
                    {/* <YourBooking/> */}
                    <Outlet/>
                    <New/>
                    <Footer/>
            </PaymentProvider>
        </AuthProvider>
        </div>
    )
}
const appRoute = createBrowserRouter(
    [
   {
    //    path:"/",
       element:<AppLayOut/>,
       children:[
        {
            path:"/",
            element:<Form/>
        },
        {  
            path:"/auth",
            element:<Private path={"/auth"}/>
        },
        {
            path:"/bookings",
            element:<Private path={"/bookings"}/>
        },
        {
            path:"/events",
            element:<Private path={"/events"}/>,
            children:[
                {
                    path:"events/book",
                    element:<Eventitem></Eventitem>,
                    children:[
                        {
                            path:"book/payment",
                            element:<PaymentGateway></PaymentGateway>
                        }
                    ]
                }
            ]
        },
    ],
}, 
{
        path:"/admin",
        element:<AdminPanel/>,
        children:[
            {
                path:"/admin/customers",
                element:<CustomersList/>
            },
            {
                path:"/admin/dashboard",
                element:<Private path={"dashboard"}/>
            }
        ]
    },
])
const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={appRoute}/>
);
export default AppLayOut;

