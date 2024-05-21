import React, { useEffect } from 'react'
import { useContext,useState } from 'react'
import { ChatContext } from '../context/ContextProvider'
import { useToast, Box, Button, Text, Stack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from '../components/other/ChatLoading'
import { GetSender } from '../config/Logic'
import GroupChatModal from '../components/other/GroupChatModal'

const  ChatsSection = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const {user,selectedChats, setSelectedChats,chats, setChats} = useContext(ChatContext)
  const toast = useToast()

  const fetch_chats = async()=>{
    try{ 
             
            const response = await fetch("http://localhost:8000/api/chats",{
              method:"GET",
              headers:{
                Authorization:`Bearer ${user.token} `
              }
            })
            const data = await response.json()
            console.log(data)
            const filted_data = data.filter((c)=>{
               return c.users.length > 1
            })
            console.log("filtered data")
            console.log(filted_data)
            setChats(filted_data)
    }catch(e)
    {
      toast({
        title: "Error Occured!",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(()=>{
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
      fetch_chats()
  },[fetchAgain])

  return (
<Box
      d={{ base: selectedChats ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >

<Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"

      
      >
       <Box>
       My Chats
       </Box>
        
        
      <GroupChatModal>
      <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
      </GroupChatModal>
          
       
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChats(chat)}
                cursor="pointer"
                bg={selectedChats === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChats=== chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                 {/* {chat.chatName} */}
                  {!chat.isGroupChat? GetSender(loggedUser, chat.users): chat.chatName }
                </Text>
              </Box>))}</Stack>):(<ChatLoading></ChatLoading>)
            }
      </Box>

    </Box>
    
    
  )
}
/* <div className='ChatsSection'></div> */
export default ChatsSection 