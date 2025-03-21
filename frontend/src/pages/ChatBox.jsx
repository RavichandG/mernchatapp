import React, { useContext } from 'react'
import { ChatContext } from '../context/ContextProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from '../components/SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChats } = useContext(ChatContext);

  return (
    <Box d={{ base: selectedChats ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px">
         <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox