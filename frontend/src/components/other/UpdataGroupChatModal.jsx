import React, { useContext, useState } from 'react'
import { Button, IconButton } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Modal,ModalBody,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalFooter } from '@chakra-ui/react';
import { FormControl,Input } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { ChatContext } from '../../context/ContextProvider';
import { Box } from '@chakra-ui/react';
import UserBadgeItem from './UserBadgeItem';
import { useToast } from '@chakra-ui/react';
import UserListItem from '../userAvatar/userListItem';

const UpdataGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChats, setSelectedChats, user } = useContext(ChatContext)
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast()

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
        
          const  response = await fetch(`http://localhost:8000/api/user?search=${search}`, {
            method:"GET",
            headers:{
                Authorization: `Bearer ${user.token}`
            }
          });
          const data = await response.json()
          console.log(data);
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        }
      };

    const handleRename = async () => {
      
        if (!groupChatName) return;
    
        try {
          setRenameLoading(true);
    
          const response  = await fetch(
            `http://localhost:8000/api/chats/rename`,
            {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body:JSON.stringify({
                    chatId: selectedChats._id,
                    chatName: groupChatName,
                  },)
            }
          );
          
           const data = await response.json()
           console.log(response)
          console.log(data._id);
          // setSelectedChat("");
          setSelectedChats(data);
          setFetchAgain(!fetchAgain);
          fetchMessages()
          setRenameLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
        }
        setGroupChatName("");
      };


      const handleAddUser = async (user1) => {
        
        if (selectedChats.users.find((u) => u._id === user1._id)) {
          toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        if (selectedChats.groupAdmin._id !== user._id) {
          toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
           
        try {
          setLoading(true);
          console.log("in try")
       const response =  await fetch(
            `http://localhost:8000/api/chats/groupadd`,
            {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body:JSON.stringify({
                    chatId: selectedChats._id,
                    userId: user1._id
                })
            });
            console.log("fetching completed")
         const data = await response.json()
          setSelectedChats(data);
          setFetchAgain(!fetchAgain);
          console.log("state")
          console.log(loading)
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
        setGroupChatName("");
      };

      const handleRemove = async (user1) => {
        if (selectedChats.groupAdmin._id !== user._id && user1._id !== user._id) {
          toast({
            title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        try {
          setLoading(true);
          
          const  response  = await fetch(
            `http://localhost:8000/api/chats/groupremove`,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body:JSON.stringify( {
                    chatId: selectedChats._id,
                    userId: user1._id,
                  })
            });
            const data = response.json()
    
          user1._id === user._id ? setSelectedChats() : setSelectedChats(data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
        setGroupChatName("");
      };

  return (
    <>
    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

<Modal onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
      fontSize="35px"
      fontFamily="Work sans"
      d="flex"
      justifyContent="center"
    >
      {selectedChats.chatName}
    </ModalHeader>

    <ModalCloseButton />
    <ModalBody d="flex" flexDir="column" alignItems="center">
      <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
        {selectedChats.users.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            admin={selectedChats.groupAdmin}
            handleFunction={() => handleRemove(u)}
          />
        ))}
      </Box>
      <FormControl d="flex">
        <Input
          placeholder="Chat Name"
          mb={3}
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Button
          variant="solid"
          colorScheme="teal"
          ml={1}
          isLoading={renameloading}
          onClick={handleRename}
        >
          Update
        </Button>
      </FormControl>
      <FormControl>
        <Input
          placeholder="Add User to group"
          mb={1}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </FormControl>

     { loading ? (
        <Spinner size="lg" />
      ) : (
        searchResult?.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
             handleFunction={() => handleAddUser(user)} 
          />
        ))
      )}
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => handleRemove(user)} colorScheme="red">
        Leave Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default UpdataGroupChatModal