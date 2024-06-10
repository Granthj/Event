import { useContext } from "react";
import { AuthContext} from "../utils/authContext";

const ProtectedRoute = ()=>{
    const {tokenData} = useContext(AuthContext);
    console.log("From Protected")
}

export default ProtectedRoute;