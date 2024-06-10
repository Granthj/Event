const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const authHeader = req.get('AdminAuth');
    
    if(!authHeader){
        req.adminAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if(!token || token == ""){
        req.adminAuth = false;
        return next();
    }
    let decodeToken;
    try{
        decodeToken = jwt.verify(token,'GoodAdmin');
    } catch{
        req.adminAuth = false;
        return next();
    }
    if(!decodeToken){
        req.adminAuth = false;
        return next();
    }
    req.adminAuth = true;
    req.UserId = decodeToken.UserId;
    next();
}