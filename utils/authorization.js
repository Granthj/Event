const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
<<<<<<< HEAD
    
    const token = req.cookies.token;
    if(!token){
        req.auth = false;
        return next();
    }
    try{
        const decodeToken = jwt.verify(token, 'Iamgood');
        if(!decodeToken){
            req.auth = false;
            return next();
        }
        req.auth = true;
        req.customerId = decodeToken.customerId;
        req.email = decodeToken.email;

        next();
    }
    catch(err){
        console.error("Authorization error:", err);
        req.auth = false;
        return next();
    }
=======
    const authHeader = req.get('Authorization');
    if(!authHeader){
        // console.log("1 error")
        req.auth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if(!token || token == ""){
        // console.log("2 error")
        req.auth = false;
        return next();
    }
    let decodeToken;
    try{
        decodeToken = jwt.verify(token,'Iamgood');
    } catch{
        // console.log("3 error")
        req.auth = false;
        return next();
    }
    if(!decodeToken){
        // console.log("4 error")
        req.auth = false;
        return next();
    }
    req.auth = true;
    req.customerId = decodeToken.customerId;
    req.email = decodeToken.email;
    next();
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
}