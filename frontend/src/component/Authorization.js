import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/authContext";
// import Auth from './Auth';

const Authorization = (children)=>{
    const {tokenData} = useContext(AuthContext);
    const [data,setData] = useState(undefined);

    useEffect(()=>{
        if(tokenData !== undefined){
            setData(tokenData);
        }
        else{
            setData(null)
        }
    },[]);
    if(data !== undefined) return <Auth/>
    else return undefined
}
export default Authorization;