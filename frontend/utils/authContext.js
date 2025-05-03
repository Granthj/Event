import {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext(()=>{
})
export const AuthProvider = (props)=>{
    const [tokenData,setTokenData] = useState({
        token:localStorage.getItem('token'),
        customerId:localStorage.getItem('customerId')
    });
    const setAuthData = (token,customerId)=>{
        localStorage.setItem('token',token),
        localStorage.setItem('customerId',customerId)
        setTokenData({
            token:localStorage.getItem('token'),
            customerId:localStorage.getItem('customerId')
        })
    }
    const logout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('customerId')
        setTokenData({
            token:null,
            customerId:null
        })
    }
    console.log("in Contexttttt",tokenData.customerId)
    return (
        <>    
        <AuthContext.Provider value={{token:tokenData.token, customerId:tokenData.customerId, setAuthData,logout}}>
            {props.children}
        </AuthContext.Provider>
    </>
    )
}



