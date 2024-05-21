import React, { useContext } from 'react'
import SideDrawer from '../components/other/SideDrawer'
import ChatBox from './ChatBox'
import ChatsSection from './ChatsSection'
import { ChatContext } from '../context/ContextProvider'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'

const ChatPage = () => {
  const {user} = useContext(ChatContext)
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
     <div className='ChatPage'>
     {user&&<SideDrawer></SideDrawer>}

    <div className='ChatDiv'>
      {user && <ChatsSection fetchAgain={fetchAgain}></ChatsSection>}
      {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></ChatBox>)}
    </div>
    </div> 
  )
}

/*
    <div style={{ width: "100%" }}>
{user && <SideDrawer />}
<Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
  {user && <ChatsSection />}
  {user && <ChatBox />}
  {/* <ChatsSection>

  </ChatsSection>
  <ChatBox /> }
  </Box>
  </div>*/



export default ChatPage