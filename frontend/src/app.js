import { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import ReactDom from 'react-dom/client';
import './css/App.css'
import Navbar from './component/navbar.js';
import EventsPage from './component/Events.js';
import YourBooking from './component/YourBooking.js';
import Footer from './component/Footer.js';
import Private from './component/Private.js';
import Admin from './component/Admin.js';
import Dashboard from './component/Dashboard.js';
import AdminNavbar from './component/AdminNavbar.js';
import { AuthContext, AuthProvider } from './utils/authContext.js';
import { AdminAuthContext, AdminAuthProvider } from './utils/adminAuth.js'
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route, useNavigate, Outlet, createRoutesFromElements, useNavigation } from 'react-router-dom';
import CustomersList from './component/Customers.js';
import Eventitem from './component/Eventitem.js';
import PaymentGateway from './component/PaymentGateway.js';
import { PaymentProvider, PaymentContext } from './utils/paymentId.js';
import ForgotPassword from './component/ForgotPassword.js';
import SignUp from './component/SignUp.js';
import Login from './component/Login.js';
import Error from './component/Error.js'
// import NewPassword from './component/NewPassword.js';
const AdminPanel = () => {
    return (
        <>
            <AdminAuthProvider>
                <AdminNavbar />
                <Admin />
                <Outlet />
                {/* <Dashboard/> */}
            </AdminAuthProvider>

        </>
    )
}
const AppLayOut = () => {
    const navigate = useNavigate();
    const handleCitySelected = (cityData) => {
        const [city, state] = cityData.name.split(',').map(str => str.trim());
        navigate(`/${city}`, {
            state: {
                location: {
                    city: city,
                    state: state,
                }

            }
        });
        // You can pass this data to a map component, global state, etc.
    };
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 
            <AuthProvider>
                <PaymentProvider> */}
            <div className="app-wrapper">
                <Navbar onCitySelected={handleCitySelected} />
                {/* <YourBooking/> */}
                <main className="flex-grow-1">
                    <Outlet />
                    {/* <New /> */}
                </main>

                <Footer />
            </div>
            {/* </PaymentProvider>
            </AuthProvider> */}
        </div>
    )
}
const appRoute = createBrowserRouter(
    [
        {
            //    path:"/",
            element: <AppLayOut />,
            children: [
                {
                    path: "/",
                    element: <EventsPage />,
                    index: true,
                },
                {
                    path: "*",
                    element: <Error />
                },
                {
                    path: "/:city",
                    element: <EventsPage />,
                },
                {
                    path: "forgot-password",
                    element: <ForgotPassword />
                },

                {
                    path: "/profile",
                    element: <Private path={"/profile"} />
                },
                {
                    path: "/bookings",
                    element: <Private path={"/bookings"} />
                },
                {
                    path: "/events-cart",
                    element: <Private path={"/events-cart"} />
                },
                {
                    path: "/login",
                    element: <Private path={"/login"} />,
                },
                {
                    path: "/signup",
                    element: <SignUp />
                }
            ],
        },
        {
            path: "/admin",
            element: <AdminPanel />,
            children: [
                {
                    path: "/admin/customers",
                    element: <CustomersList />
                },
                {
                    path: "/admin/dashboard",
                    element: <Private path={"dashboard"} />
                }
            ]
        },
        {
            path: "*",
            element: <Error />
        }
    ])
// Ensure ReactDom.createRoot is only called once
const container = document.getElementById('root');
let root;
if (!container._reactRootContainer) {
    root = ReactDom.createRoot(container);
} else {
    root = container._reactRootContainer;
}

root.render(
    <AuthProvider>
        <PaymentProvider>
            <RouterProvider router={appRoute} />
        </PaymentProvider>
    </AuthProvider>
);
export default AppLayOut;

