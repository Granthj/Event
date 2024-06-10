import {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext(()=>{
    // const [tokenData,setTokenData] = useState()
})
export const AuthProvider = (props)=>{
    const [tokenData,setTokenData] = useState();
    console.log("in Context",tokenData)
    return (
        <>    
        <AuthContext.Provider value={{tokenData,setTokenData}}>
            {props.children}
        </AuthContext.Provider>
    </>
    )
}



