const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next)=>{
  try {
    const token = req.header('token');
    if (!token){
      return res.status(403).json({msg:"Not Authorized - Blocked by Authorizer"})
    }
    const payload = await jwt.verify(token, process.env.jwtSecret);
    if(!payload.user.id){
      return res.status(403).json({msg:"Not Authorized - Fraudulent token"})
    }
    req.user = payload.user;
  } catch (error) {
    console.error("authorizer err",error.message);
    res.json({msg:error.message})
  };
  next();
}