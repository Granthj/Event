import { Link, NavLink } from 'react-router-dom';
import { AdminAuthContext } from '../utils/adminAuth';
import { useContext } from 'react';

const AdminNavbar = ()=>{
    const {admintokenData, setAdminTokenData} = useContext(AdminAuthContext);
    // console.log(admintokenData,"chand");
    return(
        <div style={{width:"100%",height:"90px",backgroundColor:"GrayText"}}>
            <ul>
                <li>
                    <NavLink to="customers">Customers List</NavLink>
                </li>
            </ul>
        </div>
    )
}

export default AdminNavbar;