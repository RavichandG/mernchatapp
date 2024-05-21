const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const protect = asyncHandler( async(req, res, next)=>
{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
            try{
           token = req.headers.authorization.split(" ")[1]
           // bearer jdfsjskjafkj
           const valid = jwt.verify(token, "dsjfkjdajfjsjfdafdasfd")
           console.log(valid)
           req.user = await userModel.findById(valid.userid).select("-password")
           next()
            }catch(e)
            {
             res.status(401)
             throw new Error(e.message)
            }
    }
    if(!token)
    {
        res.status(401)
        throw new Error("Not Authorized, No Token")
    }
})

module.exports = protect