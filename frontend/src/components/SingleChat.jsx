import React, { useContext, useState } from 'react'
import { ChatContext } from '../context/ContextProvider'
import { Input } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { GetSender, getSenderFull } from '../config/Logic';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileDiv from './other/ProfileDiv';
import { IconButton } from '@chakra-ui/react';
import UpdataGroupChatModal from './other/UpdataGroupChatModal';
import { FormControl } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';
import ScrollableChat from './other/ScrollableChat';
import io from "socket.io-client";
import '../App.css'
const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const {user,selectedChats,setSelectedChats,render,setrender} = useContext(ChatContext)
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const toast = useToast()
  
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChats._id);
      try {
        setNewMessage("");
        console.log(newMessage)
        console.log(selectedChats._id)
        const response = await fetch("http://localhost:8000/api/messages",{
          method:"POST",
          headers:{
            'Content-Type':'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body:JSON.stringify(
            {
              content: newMessage,
              chatId: selectedChats._id,
            }
          )
        })
        const data = await response.json()
        console.log(data)
        
        

       
        socket.emit("new message", data);
        setMessages([...messages, data]); 
   
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e)=>{
    setNewMessage(e.target.value);
  }

 const fetchMessages = async () => {
    if (!selectedChats) return;

    try {
      
      setLoading(true);

      const response = await fetch(`http://localhost:8000/api/messages/${selectedChats._id}`,{
        method:"GET",
        headers:{
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await response.json()
      console.log(messages)
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChats._id);

      setrender(!render)
    } catch (error) {
    /*   toast({
        title: "Error Occured!",
        description: "sunny",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      }); */
      console.log(error)
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));


  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
       /*  if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        } */
      } else {
        console.log("message")
        console.log(newMessageRecieved)
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChats;
   
  },[selectedChats]);

    return(<>
        {
            selectedChats ? (
                <>
                  <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    d="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                  >
                    <IconButton
                      d={{ base: "flex", md: "none" }}
                      icon={<ArrowBackIcon />}
                      onClick={() => setSelectedChats("")} 
                    />
                    { messages && !selectedChats.isGroupChat ? (
                        <>
                          {GetSender(user, selectedChats.users)}
                       {/*    <ProfileDiv user={getSenderFull(user, selectedChats.users)} /> */}
                        </>
                       ): (
                        <>
                          {selectedChats.chatName.toUpperCase()}
                          <UpdataGroupChatModal
                         fetchMessages={fetchMessages} 
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain} 
                          />
                        </>
                       )
                    }
                  </Text>
                  <Box
            display="flex"
            flexDirection="column"
            justifyContent="end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            
            border="2px solid blue"
            padding="10px"
            height="80vh"
          >

        {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
            onKeyDown={sendMessage} 
              id="first-name"
              isRequired
              mt={3}
              
            >
            {/*   {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                position="relative"
                bottom="1rem"
              />
            </FormControl>

          </Box>
                </>
              ):(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
              ) 


        }
        </>)
    
}  

export default SingleChat