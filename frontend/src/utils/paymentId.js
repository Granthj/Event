import {createContext, useEffect, useState} from 'react';

export const PaymentContext = createContext(()=>{
    // const [tokenData,setTokenData] = useState()
})
export const PaymentProvider = (props)=>{
    const [paymentId,setpaymentId] = useState();
    return (
        <>    
        <PaymentContext.Provider value={{paymentId,setpaymentId}}>
            {props.children}
        </PaymentContext.Provider>
    </>
    )
}