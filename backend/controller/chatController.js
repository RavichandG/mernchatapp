const asyncHandler = require("express-async-handler")
const ChatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

const accessChat = asyncHandler(async(req, res)=>{
  const {userId} = req.body;

  if(!userId)
  {
    console.log("userid is not received")
    res.sendStatus(400)
  }

  let Chat_data = await ChatModel.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}}
    ]
  }).populate("users","-password").populate("latestMessage")

  Chat_data = await userModel.populate(Chat_data,{
    path:"latestMessage.sender",
    select:"name email"
  })
  if(Chat_data.length>0)
  {
    res.send(Chat_data[0])
  }else{
    let chatInfo = {
        chatName:"sender",
        isGroupChat : false,
        users:[req.user.id,userId]
    }
    try{
        const createdChat = await ChatModel.create(chatInfo)
        const FullChat = await ChatModel.findOne({_id:createdChat._id}).populate("users","-password")
        res.status(200).json(FullChat)
      }catch(e)
      {
        res.status(400)
        throw new Error(e.message)
      }
  }

  
})

const fetchChats = asyncHandler(async(req, res)=>{
     const userId = req.user._id
     try{
      console.log("fetching")
         let result = await ChatModel.find({users: {$elemMatch: {$eq:userId}}})
         .populate("users","-password")
         .populate("groupAdmin","-password")
         .populate("latestMessage").sort({updatedAt:-1})

         result = await userModel.populate(result,{
            path:"latestMessage.sender",
            select:"name email"
         })

        res.status(200).send(result)
         
     }catch(e)
     {
        console.log(e)
     }
})

const createGroupChat = asyncHandler(async(req, res)=>{
         if(!req.body.users || !req.body.name)
         {
          return res.status(400).send({ message: "Please Fill all the feilds" });
         }

         let users = JSON.parse(req.body.users)

         if(users.length<2)
         {
          return res.status(400).send({message:"More than 2 members are required to form a group"})
         }

         users.push(req.user)

         try{
          const groupChat = await ChatModel.create({
            chatName:req.body.name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user
          })

          const fullGroupChat = await ChatModel.findOne({_id:groupChat._id})
          .populate("users","-password")
          .populate("groupAdmin","-password")

          res.status(200).json(fullGroupChat)
         }catch(e)
         {
            console.log(e)
         }
})

const renameGroup = asyncHandler(async(req, res)=>{
  console.log("renaming")
     const {chatId, chatName} = req.body;

     const updatedChat = await ChatModel.findByIdAndUpdate(chatId,{chatName},{new:true})
     .populate("users","-password")
     .populate("groupAdmin","-password")

     if(!updatedChat)
     {
      res.status(404)
      throw new Error("Chat not found")
     }else{
      res.json(updatedChat)
     }
})

const removeFromGroup = asyncHandler(async(req, res)=>{
  const {chatId, userId} = req.body;

   const removed = await ChatModel.findByIdAndUpdate(chatId,{
    
      $pull: { users: userId },
    },
    {
      new: true,
    }
   ).populate("users","-password")
   .populate("groupAdmin","-password")


   if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
   return res.json(removed);
  }
})

const addToGroup = asyncHandler(async(req, res)=>{
  const {chatId, userId} = req.body;

  const added = await ChatModel.findByIdAndUpdate(chatId,{
        $push:{users:userId},
  },{new:true}).populate("users","-password")
  .populate("users","-password")

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})

module.exports = {
    accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup
}