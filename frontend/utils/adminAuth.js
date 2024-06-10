import {createContext, useEffect, useState} from 'react';

export const AdminAuthContext = createContext(()=>{
    // const [tokenData,setTokenData] = useState()
})
export const AdminAuthProvider = (props)=>{
    const [admintokenData,setAdminTokenData] = useState(null);
    // console.log("in Context",tokenData)
    return (
        <>    
        <AdminAuthContext.Provider value={{admintokenData,setAdminTokenData}}>
            {props.children}
        </AdminAuthContext.Provider>
    </>
    )
}