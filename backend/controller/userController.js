
const userModel = require("../models/userModel")
const generateToken = require("../config/generateToken")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")

const RegisterUser = asyncHandler(async(req, res)=>
{
     const {name, password, email} = req.body

     if(!name || !password || !email)
     {
        res.status(400)
        throw new Error("All fields must be filled")
     }

     const Email_exists = await userModel.findOne({email});
     if(Email_exists)
     {
        res.status(400)
        throw new Error("Given Email is already in use")
     }
       
     const salt = await bcrypt.genSalt(10)
     const hash_password = await bcrypt.hash(password,salt)
     const user = await userModel.create({
        name,
        password:hash_password,
        email
     })

     if(user)
     {
        res.status(201).json({_id:user._id, name:user.name, email:user.email, pic:user.pic,
            token:generateToken(user._id)})
     }
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
     
    const password_match = await bcrypt.compare(password,user.password)
    if(user && password_match)
    {
       res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token: generateToken(user._id)
       }) 
    }else{
        res.status(400) 
        throw new Error("Email or password is Wrong")
    }
})

const getAllUsers = asyncHandler(async(req, res)=>{
   const keyword = req.query.search ? {
      $or:[{name:{$regex:req.query.search, $options:"i"}},{email:{$regex:req.query.search, $options:"i"}}]
   }:{}

 /*   const keyword = req.query.search ? {name:{$regex:req.query.search}}:{} */  // for only name
  
   const users = await userModel.find(keyword).find({_id:{$ne:req.user._id}})
   console.log(users)
   res.json(users)
})

module.exports = {RegisterUser, loginUser, getAllUsers}