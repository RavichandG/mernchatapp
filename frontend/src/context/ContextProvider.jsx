
import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { OtpContext } from "./OtpContext";

const ChatContext = createContext()

const ChatProvider = ({children})=>{
    const {nameFromUser,  setNameFromUser, emailFromUser, setEmailFromUser, passwordFromUser, setPasswordFromUser} = useContext(OtpContext)
    const navigate = useNavigate()
    const [user,setuser] = useState()
    const [selectedChats, setSelectedChats] = useState([]);
    const [chats, setChats] = useState([])
    const [render,setrender] = useState(false)

    useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userData)
        if(!userData && !emailFromUser && !passwordFromUser && !nameFromUser)
        {
            navigate("/")
        }
    },[navigate])
    return(<ChatContext.Provider value={{user, setuser,selectedChats, setSelectedChats,chats, setChats,render,setrender}}>
        {children}
    </ChatContext.Provider>)
}

export {ChatProvider,ChatContext} 