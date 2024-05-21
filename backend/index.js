const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const userRouter = require("./router/Userrouter")
const chatRouter = require("./router/chatRouter")
const MessageRouter = require("./router/MessageRouter")
const bodyParser = require('body-parser');

const otpRouter = require("./router/otpRoutes")

const nodeMailer = require("nodemailer")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
/* app.use(cors({
    origin:"http://localhost:5173"
})) */
app.use(cors("*"))
app.use(bodyParser.json())
mongoose.connect('mongodb://localhost:27017/chatapp').then(()=>{
    console.log("mongodb connected")
}).catch(()=>{
    console.log("mongodb not connected")
})
const PORT = 8000

app.use("/api/user",userRouter)
app.use("/api/chats",chatRouter)
app.use("/api/messages",MessageRouter)
app.use("/api/otp",otpRouter)

const server = app.listen(PORT,()=>console.log("server is running at port 8000"))

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
     
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    }); 

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
      
            socket.in(user._id).emit("message recieved", newMessageRecieved);
          });
        });
        socket.off("setup", () => {
          console.log("USER DISCONNECTED");
          socket.leave(userData._id);
        });
      
  })

 